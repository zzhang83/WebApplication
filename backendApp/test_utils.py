from .models import *
from django.utils.timezone import make_aware
from datetime import datetime, timedelta

TIME = make_aware(datetime.now())
def set_up():
    dataset = DataSet.objects.create(
        name="num1",
        most_recent_time=TIME,
        type="classification",
        metric="f1",
    )
    dataset.save()

    result = Result.objects.create(
        time=TIME,
        dataset=dataset,
    )
    result.save()

    record = Record.objects.create(
        method="baseline",
        score=0.13,
        duration=12,
        result=result,
    )
    record.save()

    record = Record.objects.create(
        method="baseline",
        score=0.16,
        duration=11,
        result=result,
    )
    record.save()

    statistic = Statistic.objects.create(
        time=TIME,
        method='baseline',
        score_avg=0.14,
        type='classification',
    )
    statistic.save()

    newTIME = make_aware(datetime.now() - timedelta(days=10))
    statistic = Statistic.objects.create(
        time=newTIME,
        method='baseline',
        score_avg=0.13,
        type='classification',
    )
    statistic.save()
