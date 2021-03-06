# Generated by Django 2.0.4 on 2018-04-29 17:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=15)),
                ('time', models.DateTimeField()),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('text', models.CharField(max_length=500)),
            ],
        ),
        migrations.CreateModel(
            name='DataSet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=100)),
                ('most_recent_time', models.DateTimeField()),
                ('type', models.CharField(max_length=50)),
                ('metric', models.CharField(max_length=40)),
            ],
        ),
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('docfile', models.FileField(upload_to='documents/')),
            ],
        ),
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('method', models.CharField(max_length=50)),
                ('score', models.FloatField()),
                ('duration', models.IntegerField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Result',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField()),
                ('dataset', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backendApp.DataSet')),
            ],
        ),
        migrations.CreateModel(
            name='Statistic',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField()),
                ('method', models.CharField(max_length=50)),
                ('score_avg', models.FloatField()),
                ('type', models.CharField(max_length=50)),
            ],
        ),
        migrations.AddField(
            model_name='record',
            name='result',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backendApp.Result'),
        ),
    ]
