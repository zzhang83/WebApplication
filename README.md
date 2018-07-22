## Overview:
to understand how this project work, refer to:
https://github.com/mbrochh/django-reactjs-boilerplate/tree/master

bundle has already been generated by command `node_modules/.bin/webpack --config webpack.local.config.js
`, and all generated files are in ./djreact/static/bundles/local

## Collaberations
Jin Yan(jyan16), Tong Zhang(tzhang48), Zexuan Huang(zhuang31), Zhiwei Zhang(zzhang83)

## Website deployment

ec2-54-196-181-229.compute-1.amazonaws.com

## How to Run React:
Our project needs python3, pip3 and npm.

1. `cd` to project root directory
1. run `node_modules/.bin/webpack --config webpack.local.config.js` to generate react bundle files. They should now be
stored in backendApp/static/bundles/local.
1. `npm install` to install all packages
1. `pip3 install -r req.txt` to install all python package
1. `node dev_server.js` to start webpack dev server. Note that this is import to make react run correctly
1. `python3 manage.py runserver` to start Django

## Views
There are three views in the system:

1. 'localhost:8000/' index view. You can upload csv file here. Our system will check whether your file is uploadable.
1. 'localhost:8000/data' the home page of website.

## RESTful API
Our system uses AJAX to communicate between frontend and backend.


1. `GET localhost:8000/all/?`:

~~~~
response = 
{
    'ok': bool,
    'data': {
        task_type: [
            {
                'name': string,
                'most_recent_time': string,
                'metric': string,
                'most_recent_result': 
                {
                    score_name: score_value,
                    ...
                }
            }, 
            ...
        ]
    },
    'statistic': {
        task_type: {
            {
                time: string,
                score_name: score_value,
                ...
            },
            ...
        }
    }
}
~~~~

2. `GET localhost:8000/dataset?data_name=my_dataset`:

This request will response the individual data and its corresponding statistic result. The statistic result
contains mean, median, standard deviation. Client could use data field in statistic to draw frequency density histogram 
for our score.
~~~~
response = {
    ok: bool,
    dataset: {
        metric: string,
        most_recent_time: DateTime,
        name: string,
        type: string,
    },
    results: [
        {
            Baseline: float,
            duration: int,
            time: DateTime
        }, ...
    ],
    statistic: {
        'data': [(float, float), ...],
        'mean': float,
        'median': float,
        'standard_deviation': float,
    }
}
~~~~

3. `POST localhost:8000/upload?file_dir=my_file_directory`:


## Maintenance

#### Superuser for Django

1. name: jinyan
1. email: jin_yan@brown.edu
1. password: abcd12345678

#### normal user
1. name: tong
1. password: abcd12345678
### NOTE
1. delete DATABASE_URL in your heroku config variable!!!!!!!!!
2. Compressor will not run is DEBUG is TRUE
















