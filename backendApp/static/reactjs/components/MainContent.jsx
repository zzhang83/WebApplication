import React from "react"
import Category from "./Category"
import XYSelector from "./XYSelector"
// let echarts = require("echarts");
let echarts = require('echarts/lib/echarts');
require("echarts/lib/component/dataset");
require("echarts/lib/chart/line");
require("echarts/lib/chart/bar");
require("echarts/lib/chart/scatter");
require("echarts/lib/chart/effectScatter");
require("echarts/lib/chart/lines");
require("echarts/lib/component/grid");
require("echarts/lib/component/legendScroll");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/axisPointer");
require("echarts/lib/component/title");
require("echarts/lib/component/dataZoom");
require("echarts/lib/component/visualMap");
require("zrender/lib/vml/vml");
require("zrender/lib/svg/svg");

export default class MainContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            xAxis: 'baseline',
            yAxis: 'our',
            currentCategory: null,
            categoryList: [],
            data: null,
            filteredData: null,
            main_chart: null,
            summary_chart: null,
            statistics: null
        };

        this.render = this.render.bind(this);
        this.retrieveData = this.retrieveData.bind(this);
        this.formatDataForMainGraph = this.formatDataForMainGraph.bind(this);
        this.updateChart = this.updateChart.bind(this);
        this.updateChartForDataset = this.updateChartForDataset.bind(this);
        this.updateSummaryChart = this.updateSummaryChart.bind(this);
    }

    retrieveData() {
        let mythis = this;
        $.ajax({
            url: location.origin + "/all",
            type: "GET",
            success: function(data) {
                if (data.ok == true) {
                    let cl = Object.keys(data.data);
                    let axis = Object.keys(data.data[cl[0]][0].most_recent_result)
                    let mychart = echarts.init(mythis.refs.main_graph);
                    let summarychart = echarts.init(mythis.refs.summary_graph);
                    mythis.setState({
                        data: data.data,
                        categoryList: cl,
                        currentCategory: cl[0],
                        xAxis: 'baseline',
                        yAxis: 'our',
                        main_chart: mychart,
                        summary_chart: summarychart,
                        statistics: data.statistic,
                    });
                    mythis.props.rootThis.setState({data: data.data, categoryList: cl, currentCategory: cl[0]});
                    mychart.on('click', function (params) {
                        if (mychart.getOption().title[0].text == 'overview') {
                            // mychart.showLoading();
                            $.ajax({
                                url: location.origin + "/dataset/?data_name=" + params.data[2].name,
                                type: "GET",
                                success: function(data) {
                                    // mychart.hideLoading();
                                    mythis.updateChartForDataset(data);
                                },
                                error: function() {
                                    // mychart.hideLoading();
                                    alert('error retrieving data');
                                }
                            });
                        }
                    });
                } else {
                    alert('Invalid data returned!');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('error retrieving data');
            }
        });
    }

    updateSummaryChartForDataset(raw) {
        let summarychart = this.state.summary_chart;
        summarychart.clear();
        
        let option = {
            title: {
                text: 'dataset: ' + raw.dataset.name
            },
            legend: {
                show: false
            },
            animation: true,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                formatter: function(params) {
                    return '<pre>' + 'score: ' + params[0].data[0] + '\nfrequency density: ' + params[0].data[1] + '</pre>'
                }
            },
            grid: {
                right: 150,
                bottom: 60
            },
            // label: {
            //     show: true,
            //     position: 'top',
            //     formatter: function(params) {
            //         if (typeof params.value == 'number' ) {
            //             return params.value;
            //             // return parseFloat(Math.round(params.value * 100) / 100);
            //         }
            //         let v =  parseFloat(Math.round(params.value[1] * 100) / 100);

            //         return v > 0 ? v : ''
            //     },
            // },
            xAxis: {
                type: 'category',
                name: 'score',
                nameTextStyle: {
                    fontStyle: 'bolder',
                    fontSize: 16
                },
                nameLocation: 'middle',
                nameGap: 40,
                // min: function(val) {
                //     return Math.round((val.min - (val.max-val.min) * 0.1)*100)/100;
                // },
                // max: function(val) {
                //     return Math.round((val.max + (val.max-val.min) * 0.1)*100)/100;
                // },
                splitLine: {
                    show: true
                },
                scale: true,
                axisLabel: {
                    formatter: function(value, index) {
                        return parseFloat(Math.round(value * 100) / 100);
                    }
                }
            },
            yAxis: {
                type: 'value',
                nameLocation: 'end',
                name: 'frequency density',
                nameTextStyle: {
                    fontStyle: 'bolder',
                    fontSize: 16
                },
                nameGap: 10,
                splitLine: {
                    show: true
                }
            },
            dataZoom: [{
                type: 'slider',
                filterMode: 'filter',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100,
                height: 12,
            },
            {
                type: 'inside',
                filterMode: 'filter',
                xAxisIndex: [0],
                start: 0,
                end: 100
            }],
            series: {
                type: 'bar',
                name: 'frequency density',
                barCategoryGap: 0,
                itemStyle: {
                    borderColor: 'black',
                    borderWidth: 0.5,
                },
                data: raw.statistic.data,
            }

        }
        summarychart.setOption(option);
    }

    updateSummaryChart() {
        let summarychart = this.state.summary_chart;
        let oldOption = summarychart.getOption();
        if (oldOption && oldOption.title && oldOption.title[0].text == this.state.currentCategory) {
            return;
        }
        summarychart.clear();
        let statistics = this.state.statistics[this.state.currentCategory];

        let dimensions = [];
        let ys = [];
        for (let i = 0; i < statistics.length; i++) {
            for (let key in statistics[i]) {
                if (dimensions.includes(key) == false) {
                    dimensions.push(key);
                    if (key != 'time') {
                        ys.push(key);
                    }
                }
            }
        }

        let series = [];
        for (let i = 0; i < ys.length; i++) {
            let s = {
                type: 'bar',
                name: ys[i],
                dimensions: ['time', ys[i]],
                encode: {
                    x: 'time',
                    y: ys[i]
                },
                barGap: 0,
                // barCategoryGap: '70%',
            }
            series.push(s);
        }

        let option = {
            title: {
                text: this.state.currentCategory
            },
            animation: true,
            dataset: {
                source: statistics
            },
            legend: {
                show: true,
                right: 640,
                top: 50,
                orient: 'vertical',
                align: 'right',
            },
            grid: {
                left: 150,
                right: 150,
                bottom: '25%',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            xAxis: {
                type: 'category',
                name: 'time',
                nameTextStyle: {
                    fontStyle: 'bolder',
                    fontSize: 16
                },
                nameLocation: 'middle',
                nameGap: 35,
                min: 'dataMin',
                max: 'dataMax',
                splitLine: {
                    show: true
                },
                axisLabel: {
                    margin: 4,
                    formatter: function(value, index) {
                        let date = new Date(value);
                        let texts = [(date.getMonth() + 1), date.getDate()];
                        return texts.join('/');
                    }
                }
            },
            yAxis: {
                type: 'value',
                nameLocation: 'end',
                name: 'score',
                nameTextStyle: {
                    fontStyle: 'bolder',
                    fontSize: 16
                },
                nameGap: 10,
                // min: function(val) {
                //     return Math.round((val.min - (val.max-val.min) * 0.1)*100)/100;
                // },
                // max: function(val) {
                //     return Math.round((val.max + (val.max-val.min) * 0.1)*100)/100;
                // },
                splitLine: {
                    show: true
                }
            },
            dataZoom: [{
                type: 'slider',
                filterMode: 'filter',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100,
                height: 12,
            },
            {
                type: 'inside',
                filterMode: 'filter',
                xAxisIndex: [0],
                start: 0,
                end: 100,              
            }],
            series: series
        }
        summarychart.setOption(option);
    }

    updateChartForDataset(raw) {
        let mychart = echarts.init(this.refs.main_graph);
        mychart.clear();
        $("#xySelectorWrapper").hide();
        let data = raw.results;
        if (data.length == 0) {
            alert('not enough data for '+raw.dataset.name);
            return;
        }

        let dimensions = [];
        let ys = [];
        for (let i = 0; i < data.length; i++) {
            for (let key in data[i]) {
                if (dimensions.includes(key) == false) {
                    dimensions.push(key);
                    if (key != 'time') {
                        ys.push(key);
                    }
                }
            }
        }

        let series = [];
        let legends = {'score':[], 'duration':[]};
        for (let i = 0; i < ys.length; i++) {
            let s = {
                type: ys[i].endsWith('Duration')?'bar':'line',
                yAxisIndex: ys[i].endsWith('Duration')?1:0,
                name: ys[i],
                dimensions: ['time', ys[i]],
                encode: {
                    x: 'time',
                    y: ys[i],
                    tooltip: ys[i]
                }
            }
            series.push(s);
            if (ys[i].endsWith('Duration')) {
                legends['duration'].push(ys[i]);
            } else {
                legends['score'].push(ys[i]);
            }
        }

        let option = {
            dataset: {
                source : data
            },
            title: {
                show: false,
                text: 'details',
            },
            animation: true,
            legend: [{
                show: true,
                type: 'scroll',
                width: '80%',
                left: '15%',
                data: legends['score']
            },{
                show: true,
                type: 'scroll',
                width: '80%',
                left: '15%',
                top: 20,
                data: legends['duration']                
            }],
            grid: {
                left: 60,
                right: 60,
                bottom: 60,
                top: 70
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            xAxis: {
                type: 'category',
                name: 'Time',
                nameTextStyle: {
                    fontStyle: 'bolder',
                    fontSize: 16
                },
                nameLocation: 'middle',
                nameGap: 40,
                min: 'dataMin',
                max: 'dataMax',
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: function(value, index) {
                        let date = new Date(value);
                        let texts = [(date.getMonth() + 1), date.getDate()];
                        return texts.join('/');
                    }
                }
            },
            yAxis: [{
                type: 'value',
                scale: true,
                nameLocation: 'end',
                name: 'score',
                nameTextStyle: {
                    fontStyle: 'bolder',
                    fontSize: 16
                },
                nameGap: 10,
                // min: function(val) {
                //     return Math.round((val.min - (val.max-val.min) * 0.1)*100)/100;
                // },
                // max: function(val) {
                //     return Math.round((val.max + (val.max-val.min) * 0.1)*100)/100;
                // },
                splitLine: {
                    show: false
                }
            }, {
                type: 'value',
                scale: true,
                nameLocation: 'end',
                position: 'right',
                name: 'duration',
                nameTextStyle: {
                    fontStyle: 'bolder',
                    fontSize: 16
                },
                nameGap: 10,
                min: function(val) {
                    return 0;
                    // return Math.round((val.min - (val.max-val.min) * 0.1)*100)/100;
                },
                // max: function(val) {
                //     return Math.round((val.max + (val.max-val.min) * 0.1)*100)/100;
                // },
                splitLine: {
                    show: false
                }
            }],
            dataZoom: [{
                type: 'slider',
                filterMode: 'empty',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100,
                height: 12,
            },
            {
                type: 'inside',
                filterMode: 'empty',
                xAxisIndex: [0],
                start: 0,
                end: 100
            },
            {
                type: 'slider',
                filterMode: 'empty',
                show: true,
                yAxisIndex: [0],
                left: '0%',
                start: 0,
                end: 100,
                width: 12,
                labelPrecision: 1,
                textStyle: {
                    fontSize: 10,
                }
            },
            // {
            //     type: 'inside',
            //     filterMode: 'filter',
            //     yAxisIndex: [0],
            //     start: 0,
            //     end: 100
            // },
            {
                type: 'slider',
                filterMode: 'empty',
                show: true,
                yAxisIndex: [1],
                right: '0%',
                start: 0,
                end: 100,
                width: 12,
                labelPrecision: 1,
                textStyle: {
                    fontSize: 10,
                }
            },
            // {
            //     type: 'inside',
            //     filterMode: 'filter',
            //     yAxisIndex: [1],
            //     start: 0,
            //     end: 100
            // }
            ],
            series: series
        }

        mychart.setOption(option);
        this.updateSummaryChartForDataset(raw);
    }

    formatDataForMainGraph(entry) {
        let x = entry.most_recent_result[this.state.xAxis];
        let y = entry.most_recent_result[this.state.yAxis];

        let now = new Date();
        let t = Math.round((now-new Date(entry.most_recent_time))/(1000*60*60*24));
        return [x,y, entry, t];
    }

    updateChart() {
        let mychart = this.state.main_chart;
        mychart.clear();
        $("#xySelectorWrapper").show();
        // let data = this.state.filteredData.map(this.formatDataForMainGraph);
        let data = [];
        let minn = Number.MAX_VALUE;
        let maxn = Number.MIN_VALUE;
        let minr = 10;
        let maxr = 50;
        let now = new Date();
        for (let i = 0; i < this.state.filteredData.length; i++) {
            let entry = this.state.filteredData[i];
            data.push([
                entry.most_recent_result[this.state.xAxis],
                entry.most_recent_result[this.state.yAxis],
                entry,
                Math.round((now-new Date(entry.most_recent_time))/(1000*60*60*24))
            ]);
            let n = parseInt(entry.number);
            minn = Math.min(minn, n);
            maxn = Math.max(maxn, n);
        }

        let mythis = this;
        let option = {
            animation: true,
            legend: {
                show: false
            },
            title: {
                show: false,
                text: 'overview',
            },
            tooltip: {
                formatter: function(params) {
                    let info = JSON.stringify(params.data[2], null, 4);
                    return '<pre>' + info + '</pre>';
                }
            },
            grid: {
                left: 110,
                top: 20,
                bottom: '12%'
            },
            xAxis: {
                type: 'value',
                name: mythis.state.xAxis,
                nameTextStyle: {
                    fontStyle: 'bolder',
                    fontSize: 16
                },
                nameLocation: 'middle',
                nameGap: 40,
                min: function(val) {
                    return Math.round((val.min - (val.max-val.min) * 0.2)*100)/100;
                },
                max: function(val) {
                    return Math.round((val.max + (val.max-val.min) * 0.2)*100)/100;
                },
                splitLine: {
                    show: true
                },
                axisLine: {
                    show: data.length > 0 ? false : true,
                },
                axisTick: {
                    show: data.length > 0 ? false : true,
                }
            },
            yAxis: {
                type: 'value',
                name: mythis.state.yAxis,
                nameTextStyle: {
                    fontStyle: 'bolder',
                    fontSize: 16
                },
                nameLocation: 'middle',
                nameGap: 30,
                min: function(val) {
                    return Math.round((val.min - (val.max-val.min) * 0.2)*100)/100;
                },
                max: function(val) {
                    return Math.round((val.max + (val.max-val.min) * 0.2)*100)/100;
                },
                splitLine: {
                    show: true
                },
                axisLine: {
                    show: data.length > 0 ? false : true,
                },
                axisTick: {
                    show: data.length > 0 ? false : true,
                }
            },
            dataZoom: [{
                    type: 'slider',
                    filterMode: 'weakFilter',
                    show: true,
                    xAxisIndex: [0],
                    start: 0,
                    end: 100,
                    height: 12,
                },
                {
                    type: 'slider',
                    filterMode: 'weakFilter',
                    show: true,
                    yAxisIndex: [0],
                    left: '93%',
                    start: 0,
                    end: 100,
                    width: 12,
                },
                {
                    type: 'inside',
                    filterMode: 'weakFilter',
                    xAxisIndex: [0],
                    start: 0,
                    end: 100
                },
                {
                    type: 'inside',
                    filterMode: 'weakFilter',
                    yAxisIndex: [0],
                    start: 0,
                    end: 100
                }
            ],
            series: [{
                    name: mythis.state.currentCategory,
                    type: 'scatter',
                    itemStyle: {
                        normal: {},
                        //highlight
                        emphasis: {
                            borderColor: 'gray',
                            borderWidth: 3,
                            opacity: 1,
                        }
                    },
                    symbolSize: function (val, params) {
                        // map to [minr, maxr]
                        // (n'-minr)/(n-min) = (100-n')/(max-n)
                        if (minn == maxn) {
                            return (minr+maxr)/2;
                        }
                        let n = val[2].number;
                        let radius = (minr*(maxn-n) + maxr*(n-minn)) / (maxn-minn);
                        return radius;
                    },
                    data: data
                }
            ],
            visualMap: {
                type: 'piecewise',
                pieces: [
                    {
                        lte: 3,
                        color: 'rgb(194,53,49)'
                    }, {
                        gt: 3, lte: 7,
                        color: 'rgb(240,80,57)'
                    }, {
                        gt: 7, lte: 15,
                        color: 'rgb(255,255,50)'
                    }, {
                        gt: 15, lte: 30,
                        color: 'rgb(76,255,76)'
                    }, {
                        gt: 30, lte: 60,
                        color: 'rgb(50,50,255)'
                    }, {
                        gt: 60, lte: 120,
                        color: 'rgb(110,50,155)'
                    } , {
                        gt: 120,
                        color: 'rgb(201,127,233)'
                    }
                ],
                bottom: 50,
                left: 0,
                orient: 'vertical',
                text: ['', 'Days'],
                align: 'right',
                inverse: true,
                showLabel: true,
                textGap: 5,
                itemGap: 5,
                textStyle: {
                    fontSize: 10,
                }
            }
        }
        mychart.setOption(option);
        this.updateSummaryChart();
    }

    componentDidMount() {
        this.retrieveData();
    }

    componentDidUpdate() {
        let helper = function(value, index, array) {
            for (let e of this.props.filters) {
                let name = e[1].name;
                let relation = e[1].relation;
                let target = parseFloat(e[1].value);
                if (name in value.most_recent_result) {
                    let v = value.most_recent_result[name];
                    switch(relation) {
                        case 'lt':
                            if ((v < target) == false) {
                                return false;
                            }
                            break;
                        case 'le':
                            if ((v <= target) == false) {
                                return false;
                            }
                            break;
                        case 'eq':
                            if ((v == target) == false) {
                                return false;
                            }
                            break;
                        case 'ne':
                            if ((v != target) == false) {
                                return false;
                            }
                            break;
                        case 'ge':
                            if ((v >= target) == false) {
                                return false;
                            }
                            break;
                        case 'gt':
                            if ((v > target) == false) {
                                return false;
                            }
                            break;
                    }
                } else {
                    return false;
                }
            }
            return true;
        }
        this.state.filteredData = this.state.data[this.state.currentCategory].filter(helper, this);
        this.updateChart();
    }

    render() {
        return (
            <div id="MainContent-wrapper">
                <Category categoryList={this.state.categoryList} rootThis={this}/>
                <div ref="main_graph" id="main-graph"></div>
                <div id="summary-info"></div>
                <div ref="summary_graph" id="summary-graph"></div>
                
                <XYSelector data={this.state.data} currentCategory={this.state.currentCategory} rootThis={this}/>
                
            </div>
        )
    }
}