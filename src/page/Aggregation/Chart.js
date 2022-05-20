import React, {useEffect, useState} from 'react';

import 'echarts/lib/component/title';

import 'echarts/lib/chart/line';

import 'echarts/lib/component/tooltip';

import 'echarts/lib/component/legend';

const Chart = (props) => {

    const initChart = (indice,titleName,yAxisName,id) =>{

        var echarts = require("echarts");
        var myChart = echarts.init(document.getElementById(id));
        let x = [];
        for (let i = 0; i < 30; i++) {
            x.push("");
        }

        myChart.setOption({
            title: {
                text: titleName,
                subtext: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [yAxisName]
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: true,

            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: x
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: yAxisName,
                    type: 'line',
                    data: indice,
                    markPoint: {
                        data: [
                            {type: 'max', name: 'Maximum'},
                            {type: 'min', name: 'Minimum'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: 'Average'}
                        ]
                    }
                }
            ]
        })
    };

    useEffect(() => {
        initChart(props.indice,props.titleName,props.yAxisName,props.id)
    })


    return (
        <div id={props.id} style={{width: '80%', height: 400}}></div>
    )

}

export default Chart;