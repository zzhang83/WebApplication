from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import pprint
from .utils import *
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.core.serializers import serialize
from datetime import datetime, timedelta
from .forms import DocumentForm
import os
from django.conf import settings
from django.core.validators import EmailValidator
from django.contrib.auth import authenticate, login, logout
from .config import *


# Create your views here.
def index(request):
    request.session.set_expiry(0)
    context = dict()
    user = request.user
    if user.is_authenticated:
        context['status'] = SIGNOUT
        context['method'] = 'post'
    else:
        context['status'] = SIGNIN
        context['method'] = 'get'

    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)

        if not user.is_authenticated:
            context = {
                'message': 'Please login and then upload!',
                'redirect_path': 'index.html',
                'status': SIGNIN,
            }
            return render(request, 'login.html', context)

        if form.is_valid() and check_file(request.FILES['docfile']):
            newdoc = Document(docfile=request.FILES['docfile'])
            newdoc.save()
            ok = upload(os.path.join(settings.MEDIA_ROOT, newdoc.docfile.name))
            if ok:
                context['reply_message'] = 'successfully upload file!'
                return render(request, 'submit.html', context)
            else:
                context['reply_message'] = 'load into database fail'
                return render(request, 'submit.html', context)

        else:
            context['reply_message'] = 'upload file format incorrect'
            return render(request, 'submit.html', context)
    else:
        form = DocumentForm()
        context['form'] = form
        return render(request, 'index.html', context)

def my_login(request):
    form = DocumentForm()
    if request.method == 'POST' and request.POST['status'] == SIGNOUT:
        logout(request)
        context = {
            'form': form,
            'status': SIGNIN,
            'method': 'get',
        }
        return render(request, request.POST['redirect_path'], context)

    if request.method == 'POST' and request.POST['status'] == SIGNIN:
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            context = {
                'status': SIGNOUT,
                'method': 'post',
                'form': form,
            }

            return render(request, request.POST['redirect_path'], context)
        else:
            context = {
                'message': 'information incorrect, try again!',
                'redirect_path': request.POST['redirect_path'],
                'status': SIGNIN,
            }
            return render(request, 'login.html', context)

    if request.method == 'GET':
        context = {
            'redirect_path': request.GET['redirect_path'],
            'status': SIGNIN,
        }
        return render(request, 'login.html', context)

def test(request):
    return render(request, 'test.html')


def lab(request):
    context = get_login_reply(request)
    return render(request, 'lab.html', context)


def data(request):
    context = get_login_reply(request)
    return render(request, 'data.html', context = get_login_reply(request))


def get_data(request):
    name = request.GET['data_name']
    response = dict()
    try:
        dataset = DataSet.objects.filter(name=name)
        response['ok'] = True

    except ObjectDoesNotExist:
        return JsonResponse({'ok': False})

    response['dataset'] = json.loads(serialize('json', dataset))[0]['fields']
    dataset = dataset.first()
    results = dataset.result_set.all()
    response['results'] = list()

    statistic = list()
    for result in results:
        tmp = dict()
        tmp['time'] = result.time
        records = result.record_set.all()
        for record in records:
            if record.method == 'our':
                statistic.append(record.score)
            tmp[record.method] = record.score
            tmp[record.method + ' Duration'] = record.duration
        response['results'].append(tmp)

    # get statistic
    response['statistic'] = get_statistic(statistic)

    return JsonResponse(response)


def get_all(request):
    datasets = DataSet.objects.all()
    response = dict()
    response['ok'] = True
    response['data'] = dict()
    for dataset in datasets:
        if dataset.type not in response['data'].keys():
            response['data'][dataset.type] = list()
        data = dict()
        data['name'] = dataset.name
        data['most_recent_time'] = dataset.most_recent_time
        data['metric'] = dataset.metric
        data['most_recent_result'] = dict()
        result = dataset.result_set.get(time=dataset.most_recent_time)
        data['number'] = dataset.result_set.all().values_list('time', flat=True).distinct().count()
        records = result.record_set.all()
        for record in records:
            data['most_recent_result'][record.method] = record.score
        response['data'][dataset.type].append(data)

    threshold = make_aware(datetime.now() - timedelta(days=30))
    print('get statistic after %s' % threshold)
    statistics = Statistic.objects.filter(time__gte=threshold).order_by('time')

    tmp_dict = dict()
    for statistic in statistics:
        if statistic.type not in tmp_dict:
            tmp_dict[statistic.type] = dict()
        class_entry = tmp_dict[statistic.type]

        tmp_key = str(statistic.time)
        if tmp_key not in class_entry:
            class_entry[tmp_key] = dict()
        class_entry_time = class_entry[tmp_key]
        class_entry_time[statistic.method] = statistic.score_avg

    response['statistic'] = dict()
    for class_name, class_entry in tmp_dict.items():

        response['statistic'][class_name] = list()
        for time, data in class_entry.items():
            data['time'] = time
            response['statistic'][class_name].append(data)

    return JsonResponse(response)


def contact(request):
    context = get_login_reply(request)
    return render(request, 'contact.html', context)

def submit(request):
    context = dict()
    validator = EmailValidator()
    try:
        validator(request.POST['email'])
    except ValidationError:
        context['reply_message'] = 'email format incorrect'
        return render(request, 'submit.html', context)

    contact_info = Contact.objects.create(
        type=request.POST['q'],
        name=request.POST['firstname'],
        time=make_aware(datetime.now()),
        email=request.POST['email'],
        text=request.POST['subject'],
    )
    contact_info.save()
    context['reply_message'] = 'Thanks! We will contact you soon.'
    return render(request, 'submit.html', context)
