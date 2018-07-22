from django.utils.dateparse import parse_datetime
from django.utils.timezone import is_aware, make_aware
import json
from .models import *
import pandas as pd
import numpy as np
from django.core.exceptions import ObjectDoesNotExist
from .config import *

def get_time(time_str):
    tmp = time_str.split()
    date = tmp[0].split('/')
    date.reverse()
    date = '-'.join(date)
    time = tmp[1].split(':')
    time = ':'.join(time)
    date_time = date + 'T' + time
    ret = parse_datetime(date_time)
    if not is_aware(ret):
        ret = make_aware(ret)
    return ret


def reformat(infile_dir, outfile_dir):
    with open(infile_dir, 'r') as in_file:
        data = json.load(in_file)
        with open(outfile_dir, 'w') as out_file:
            json.dump(data, out_file, indent=4)


def add_statistic(cache, time):
    for class_type, methods in cache.items():
        for method, score_list in methods.items():
            statistic = Statistic.objects.create(
                time=time,
                type=class_type,
                score_avg=score_list[0] / score_list[1],
                method=method,
            )
            statistic.save()


def create_statistic(row):
    statistic = Statistic.objects.create(
        time=get_time(row.name[2]),
        method=row.name[0],
        type=row.name[1],
        score_avg=row.Score
    )
    statistic.save()
    return statistic


def get_statistic(value_list):

    tmp = np.array(value_list)
    hist, bins = np.histogram(tmp, bins=10, density=True)
    data = list()
    for i in range(0, 10):
        data.append((np.average(bins[i: i + 2]), hist[i]))

    ret = {
        'mean': np.mean(tmp),
        'median': np.median(tmp),
        'standard_deviation': np.std(tmp),
        'data': data
    }
    return ret


def handle_uploaded_file(f):
    with open('name.txt', 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)


def upload(file_dir):
    # read data
    try:
        df = pd.read_csv(file_dir).dropna()
    except:
        return False

    # clean data
    df['Dataset'] = df['Dataset'].str.lower()
    df['Method'] = df['Method'].str.lower()
    df['ScoreMetric'] = df['ScoreMetric'].str.lower()
    df['TaskType'] = df['TaskType'].str.lower()

    # store data
    for _, row in df.iterrows():
        time = get_time(row.TimeStamp)

        # get / create dataset object
        try:
            dataset = DataSet.objects.get(name=row.Dataset)
            if time < dataset.most_recent_time:
                return False
            if time != dataset.most_recent_time:
                dataset.most_recent_time = time
        except ObjectDoesNotExist:
            print('create new dataset: %s' % row.Dataset)
            dataset = DataSet.objects.create(
                name=row.Dataset,
                most_recent_time=time,
                type=row.TaskType,
                metric=row.ScoreMetric,
            )
        dataset.save()

        # get / create result object
        try:
            result = Result.objects.get(dataset=dataset, time=time)
        except ObjectDoesNotExist:
            result = Result.objects.create(time=time, dataset=dataset)
            result.save()

        # create record object
        record = Record.objects.create(
            method=row.Method,
            score=row.Score,
            duration=int(row.Duration),
            result=result
        )
        record.save()

    # store statistic results
    grouped_df = df[['Method', 'Score', 'TaskType', 'TimeStamp']].groupby(['Method', 'TaskType', 'TimeStamp'])
    avg_result = grouped_df.aggregate(np.average).dropna()
    for _, row in avg_result.iterrows():
        create_statistic(row)

    return True


def check_file(file):
    tmp = file.name.split('.')
    if tmp[-1] != 'csv':
        return False
    return True

def get_login_reply(request):
    if request.user.is_authenticated:
        return {'status': SIGNOUT, 'method': 'post'}
    else:
        return {'status': SIGNIN, 'method': 'get'}