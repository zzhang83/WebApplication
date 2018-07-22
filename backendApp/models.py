from django.db import models


class DataSet(models.Model):
    name = models.CharField(max_length=100, default='')
    most_recent_time = models.DateTimeField()
    type = models.CharField(max_length=50)
    metric = models.CharField(max_length=40)

    def __str__(self):
        return self.name


class Result(models.Model):
    time = models.DateTimeField()
    dataset = models.ForeignKey(DataSet, on_delete=models.CASCADE)

    def __str__(self):
        return self.dataset.__str__()


class Record(models.Model):
    method = models.CharField(max_length=50, null=False)
    score = models.FloatField(null=False)
    duration = models.IntegerField(null=True)
    result = models.ForeignKey(Result, on_delete=models.CASCADE)

    def __str__(self):
        return self.method


class Statistic(models.Model):
    time = models.DateTimeField()
    method = models.CharField(max_length=50, null=False)
    score_avg = models.FloatField(null=False)
    type = models.CharField(max_length=50)

    def __str__(self):
        return self.method


class Contact(models.Model):
    type = models.CharField(max_length=15)
    time = models.DateTimeField()
    name = models.CharField(max_length=100)
    email = models.EmailField()
    text = models.CharField(max_length=500)

class Document(models.Model):
    docfile = models.FileField(upload_to='documents/')