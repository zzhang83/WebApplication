from django.contrib import admin
from .models import *


# Register your models here.
admin.site.register(DataSet)
admin.site.register(Result)
admin.site.register(Record)
admin.site.register(Statistic)