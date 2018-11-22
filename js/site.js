// global variables
var blueColor = '#2E619A';
var greyColor = '#758583';
var redColor = '#CC4B36',
    whiteColor = '#ffffff';

var sortData = function(d1, d2) {
    if (d1.key > d2.key) return 1;
    if (d1.key < d2.key) return -1;
    return 0;
};

var date_sort = function(d1, d2) {
    if (d1['#date+year'] > d2['#date+year']) return 1;
    if (d1['#date+year'] < d2['#date+year']) return -1;
    return 0;
}

var formatPercent = function(d){
    return d + "%";
}

var formatFloat = function(f){
    return d3.format(".2f")(f);
}
var formatBillion = function (d) {
    return d3.format(",.1f")(d) + " B";
};

var formatFundings = function (d) {
    return d3.format(",")(d) + " US$ billion";
};

var formatMM = function(d){
    return d3.format(",")(d) + " Million";
}

var formatYear = function(d){
    return d3.format("")(d) + " years";
}

//tooltip bar
var bartip = d3.tip().attr('class', 'd3-tip').html(function (d) {
    return d.data.key + ': ' + d3.format('0,000')(d.y);
});

function genF10 () {
    d3.csv('data/crises_length.csv', function(crises){
        var interAarr = ['Number of inter-agency appeals'],
            avgLCArr = ['Average length of crisis'],
            yearArr = ['x'];
        crises.forEach( function(element, index) {
            yearArr.push(Number(element['year']));
            interAarr.push(Number(element['Number of inter-agency appeals']));
            avgLCArr.push(Number(element['Average length of crises']));
        });
        c3.generate({
                bindto: '#chart',
                data: {
                    x: 'x',
                    type: 'line',
                    columns: [yearArr, avgLCArr, interAarr],
                    axes:{
                        'Number of inter-agency appeals': 'y2'
                    }
                },
                color: {
                    pattern: [redColor, blueColor]
                },
                axis: {
                    x: {
                        tick: {
                            centered: true,
                            outer: false
                        }
                    },
                    y: {
                        max: 10,
                        show: false,
                        tick:{
                            count: 4
                        }
                    },
                    y2:{
                        min: 0,
                        show: false,
                        tick: {
                            count: 6,
                        }
                    }
                },
                size: {
                    height: 190
                },
                padding: {left: 10, right: 10},
                tooltip:{
                    format: {
                        value: function(value, ratio, id ){
                            var format = id === 'Average length of crisis' ? formatYear : d3.format("d");
                            return format(value);
                        }
                    }
                }
            });
    }); //data/crises_length.csv
    d3.csv('data/data.csv', function(received){
        //console.log(formatFloat(element['_5_6y']*100))
        var fundingRq12 = ['1-2 years'],
            fundingRq34 = ['3-4 years'],
            fundingRq56 = ['5-6 years'],
            fundingRq7 = ['> 7 years'],
            fundingRcv12 = ['1-2 years'],
            fundingRcv34 = ['3-4 years'],
            fundingRcv56 = ['5-6 years'],
            fundingRcv7 = ['> 7 years'],
            target12 = ['1-2 years'],
            target34 = ['3-4 years'],
            target56 = ['5-6 years'],
            target7 = ['> 7 years'];

        var yearsArr = ['x'],
            targetedYearsArr = ['x'];

        received.forEach( function(element, index) {
            if (element['indicator'] === 'Funding Received') {
                fundingRcv12.push(formatFloat(Number(element['_1_2y'])));
                fundingRcv34.push(formatFloat(Number(element['_3_4y'])));
                fundingRcv56.push(formatFloat(Number(element['_5_6y'])));
                fundingRcv7.push(formatFloat(Number(element['_7y'])));
                yearsArr.push(Number(element['year']));
            } else if (element['indicator'] === 'Funding Requested') {
                fundingRq12.push(formatFloat(Number(element['_1_2y'])));
                fundingRq34.push(formatFloat(Number(element['_3_4y'])));
                fundingRq56.push(formatFloat(Number(element['_5_6y'])));
                fundingRq7.push(formatFloat(Number(element['_7y'])));
            } else {
                targetedYearsArr.push(Number(element['year']));
                target12.push(formatFloat(Number(element['_1_2y'])));
                target34.push(formatFloat(Number(element['_3_4y'])));
                target56.push(formatFloat(Number(element['_5_6y'])));
                target7.push(formatFloat(Number(element['_7y'])));
            }
        });
        //Funding requested chart
        $('#fundingRequested').data('chartObj', drowSc3tackBarChart(yearsArr, fundingRq12,fundingRq34,fundingRq56,fundingRq7,'fundingRequested'));
        //Funding received chart
        $('#fundingReceived').data('chartObj', drowSc3tackBarChart(yearsArr, fundingRcv12,fundingRcv34,fundingRcv56,fundingRcv7,'fundingReceived'));
        // People targeted
        $('#peopleTargeted').data('chartObj', drowSc3tackBarChart(targetedYearsArr, target12,target34,target56,target7,'peopleTargeted'));
    });//data/data.csv
} //genF10

function drowSc3tackBarChart (x, data, data1, data2, data3, bind) {
    return c3.generate({
                bindto: '#'+bind,
                data: {
                    x: 'x',
                    type: 'bar',
                    columns: [x, data, data1, data2, data3],
                    groups:[['1-2 years', '3-4 years', '5-6 years', '> 7 years']]
                },
                color: {
                    pattern: [redColor, blueColor, whiteColor, greyColor]
                },
                axis: {
                    x: {
                        tick: {
                            centered: true,
                            outer: false
                        }
                    },
                    y: {
                        show: false,
                    }
                },
                size: {
                    height: 190
                },
                padding: {left:10, right: 10},
                tooltip:{
                    format: {
                        value: function(value){
                            return d3.format(",")(value);
                        }
                    }
                }
            });
}//drowSc3tackBarChart

function genererF10(data, fundingData) {

    var fundingRq12 = ['Requirement'],
        fundingRq34 = ['Requirement'],
        fundingRq56 = ['Requirement'],
        fundingRq7 = ['Requirement'],
        fundingRcv12 = ['Received'],
        fundingRcv34 = ['Received'],
        fundingRcv56 = ['Received'],
        fundingRcv7 = ['Received'],
        target12 = ['Targeted'],
        target34 = ['Targeted'],
        target56 = ['Targeted'],
        target7 = ['Targeted'];

    var ndx = crossfilter(fundingData);
    var dimF = ndx.dimension(function(d) {
        return [d['#date+year'], d['#indicator+name'], d['#indicator+length']];
    });
    var groupF = dimF.group().reduceSum(function(d) {
        return d['#indicator+num'];
    }).top(Infinity).sort(sortData);

    for (var i = 0; i < groupF.length; i++) {
        if (groupF[i].key[1] == "funding requested") {
            groupF[i].key[2] == "1-2years" ? fundingRq12.push(groupF[i].value) :
                groupF[i].key[2] == "3-4years" ? fundingRq34.push(groupF[i].value) :
                groupF[i].key[2] == "5-6years" ? fundingRq56.push(groupF[i].value) : fundingRq7.push(groupF[i].value);
        } else {
            if (groupF[i].key[1] == "funding received") {
                groupF[i].key[2] == "1-2years" ? fundingRcv12.push(groupF[i].value) :
                    groupF[i].key[2] == "3-4years" ? fundingRcv34.push(groupF[i].value) :
                    groupF[i].key[2] == "5-6years" ? fundingRcv56.push(groupF[i].value) : fundingRcv7.push(groupF[i].value);
            } else {
                groupF[i].key[2] == "1-2years" ? target12.push(groupF[i].value) :
                    groupF[i].key[2] == "3-4years" ? target34.push(groupF[i].value) :
                    groupF[i].key[2] == "5-6years" ? target56.push(groupF[i].value) : target7.push(groupF[i].value);
            }
        }
    }
    var fundingsReq = [fundingRq12, fundingRq34, fundingRq56, fundingRq7],
        fundingsRecv = [fundingRcv12, fundingRcv34, fundingRcv56, fundingRcv7],
        targets = [target12, target34, target56, target7],
        targetedArr = ['x', 2011, 2012, 2013, 2014, 2015, 2016, 2017],
        titles = ["1-2 Years", "3-4 Years", "5-6 Years", "More than 7 Years"];
    for (var i = 0; i < 4; i++) {
        $('.charts').append('<div class="header"><strong>' + titles[i] + '</strong></div><div class="col-md-6 col-sm-12" id="chart' + i + '"></div><div class="col-md-6 col-sm-12" id="chartp' + i + '"></div>');
        var chartF = c3.generate({
            bindto: '#chart' + i,
            data: {
                x: 'x',
                columns: [yearArr, fundingsReq[i], fundingsRecv[i]],
                type: 'bar'
            },
            color: {
                pattern: [blueColor, redColor]
            },
            axis: {
                y: {
                    show: true,
                    tick: {
                        count: 4,
                        format: d3.format('.2s'),
                    }
                },
                x: {
                    tick: {
                        centered: true,
                        outer: false
                    }
                }
            },
            size: {
                height: 150
            },
            legend: {
                hide: false
            },
            tooltip: {
                contents : tooltip_contents
            }
        });
        var chartP = c3.generate({
            bindto: '#chartp' + i,
            data: {
                x: 'x',
                columns: [targetedArr, targets[i]],
                type: 'bar',
            },
            color: {
                pattern: [blueColor]
            },
            axis: {
                y: {
                    show: true,
                    tick: {
                        count: 4,
                        format: d3.format('.2s'),
                    },
                },
                x: {
                    tick: {
                        centered: true,
                        outer: false,
                        fit: true,
                    }
                }
            },
            size: {
                height: 150
            },
            legend: {
                hide: true
            }
        });
        $('#chartp' + i).data('chartObj', chartP);
    }
} //genererF10

function tooltip_contents(d, defaultTitleFormat, defaultValueFormat, color) {
    var $$ = this, config = $$.config, CLASS = $$.CLASS,
        titleFormat = config.tooltip_format_title || defaultTitleFormat,
        nameFormat = config.tooltip_format_name || function (name) { return name; },
        valueFormat = config.tooltip_format_value || defaultValueFormat,
        text, i, title, value, name, bgcolor, message = "";
    // You can access all of data like this:
    // console.log($$.api.element.id);
        let ele = $$.api.element.id ;
    for (i = 0; i < d.length; i++) {
        // if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }

        // ADD
        // if (d[i].name === 'IDPs') { continue; }
        //lgth = 0 : 1-2year, = 1 : 3-4years etc
        if (ele === 'chart0') {
            d[i].x === 2013 ? message = "<p>Funding requested 1−2 years crises spike due to the beginning of the Syria appeals, the largest in history.</p>" : "";
        } else if (ele === 'chart1') {
            d[i].x == 2014 ? message = "<p>Funding in the 3−4 years balloons with the advent of billion-dollar appeals in Syria and South Sudan.</p>" :
            d[i].x == 2015 ? message = "<p>Funding in the 3−4 years balloons with the advent of billion-dollar appeals in Syria and South Sudan.</p>" : "";
        } else if (ele === 'chart2' || 'chart3') {
            d[i].x ===  2017 ? message = "<p>Funding requested is primarily driven by protracted crises, especially Syria, Somalia, South Sudan and Sudan.</p>" : "";
        }

        if (! text) {
            title = d[i].x
            text = "<table class='" + CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
        }

        name = nameFormat(d[i].name);
        value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
        bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
        text += "<tr class='" + CLASS.tooltipName + "-" + d[i].id + "'>";
        text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
        text += "<td class='value'>" + formatBillion(value) + "</td>";
        text += "</tr>";

    }
    text += "<tr><td>" + message + "</td></tr>";
    return text + "</table>";
}//tooltip_contents

function genererGraphesDetails(data) {
    var cf = crossfilter(data);
    var crisesDim,
        crisesGroup,
        crisesChart;
    crisesDim = cf.dimension(function(d) {
        return d['#country+name'];
    });
    crisesGroup = crisesDim.group().reduceSum(function(d){
        return d['#indicator+consecutive+length_crisis'];
    });

    crisesChart = dc.barChart('#crises');

    crisesChart
        .width($('#crises').width())
        .height(200)
        .margins({
            top: 5,
            right: 30,
            bottom: 80,
            left: 30
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .renderHorizontalGridLines(true)
        .elasticY(true)
        .colors(blueColor)
        .dimension(crisesDim)
        .group(crisesGroup)
        .brushOn(false)
        .yAxis().ticks(4);

    crisesChart.renderlet(function(chart) {
        chart.selectAll("rect.bar").on("click", function(d) {
            chart.filter(null).filter(d.data.key).redrawGroup();
            $('.detailCharts').show();
            countrySelected(d.x);
            generateDetailsCharts(crisesDim.filter(d.x).top(Infinity).sort(date_sort));
            window.scrollTo(0,document.body.scrollHeight);
        })
    });
    dc.renderAll();
    d3.selectAll('.bar').call(bartip);
    d3.selectAll('.bar').on('mouseover', bartip.show).on('mouseout', bartip.hide);
} //genererGraphesDetails

function generateDetailsCharts(subData) {
    let poc = ['People of concern'],
        refugees = ['Refugees'],
        idmcIDPs = ['IDPs'],

        targeted = ['Targeted'],
        dates = ['x'],
        lengthCrisis = ['Consecutive length of appeals'],
        fundingReq = ['Funding requested'],
        fundingReceiv = ['Funding received'],

        lifeExp = ['Life expectancy (Years)'],
        mortality = ['Rate'],
        literacy = ['Rate'],
        primCompletion = ['Rate'],
        malnut = ['Rate'],

        affDisaster = ['Affected'],
        pop = ['Population'],
        urbanPop = ['Urban population (%)'];

    for (d in subData) {
        dates.push(Number(subData[d]['#date+year']));
        lengthCrisis.push(parseInt(subData[d]['#indicator+length_crisis']));
        targeted.push(Number(subData[d]['#inneed+targeted']));

        pop.push(Number(subData[d]['#population+total']));
        urbanPop.push(Number(subData[d]['#population+percent+urban']));
        affDisaster.push(Number(subData[d]['#affected+natural_disasters+total']));

        poc.push(Number(subData[d]['#inneed+concerned+unhrc']));
        refugees.push(Number(subData[d]['#inneed+refugees+unhrc']));
        idmcIDPs.push(subData[d]['#inneed+idmc+idps']);


        lifeExp.push(Number(subData[d]['#indicator+life_expec']));
        primCompletion.push(formatFloat(Number(subData[d]['#indicator+primary_completion'])));
        literacy.push(formatFloat(Number(subData[d]['#indicator+literacy'])));
        mortality.push(formatFloat(Number(subData[d]['#indicator+under5_mort'])));
        malnut.push(formatFloat(Number(subData[d]['#indicator+under5_underweight'])));

        fundingReq.push(Number(subData[d]['#funding+requirements']));
        fundingReceiv.push(Number(subData[d]['#funding+received']));

    } //end for
    $('#fundings').data('chartObj', generateFundingsCharts(dates, fundingReq, fundingReceiv, lengthCrisis));
    $('#target').data('chartObj', c3BarLineChart(dates, targeted, "target"));


    var dropdown1DataMapping = {},
        dropdown2DataMapping = {},
        dropdown3DataMapping = {};

        dropdown1DataMapping['indicator1'] = {'data': idmcIDPs};
        dropdown1DataMapping['indicator2'] = {'data': refugees};
        dropdown1DataMapping['indicator3'] = {'data': poc};

        dropdown2DataMapping['indicator1'] = {'data': affDisaster};
        dropdown2DataMapping['indicator2'] = {'data': pop};
        dropdown2DataMapping['indicator3'] = {'data': urbanPop};

        dropdown3DataMapping['indicator1'] = {'data': mortality};
        dropdown3DataMapping['indicator2'] = {'data': lifeExp};
        dropdown3DataMapping['indicator3'] = {'data': primCompletion};
        dropdown3DataMapping['indicator4'] = {'data': malnut};
        dropdown3DataMapping['indicator5'] = {'data': literacy};


    var selection1 = $('#moreChart1 option:selected').text(),
        select1Value = $('#moreChart1 option:selected').val(),
        selection2 = $('#moreChart2 option:selected').text(),
        select2Value = $('#moreChart2 option:selected').val(),
        selection3 = $('#moreChart3 option:selected').text(),
        select3Value = $('#moreChart3 option:selected').val();

    $('#dropdown1Title h6').text(selection1);
    $('#peopleConcern').data('chartObj', c3BarLineChart(dates, dropdown1DataMapping[select1Value].data, "peopleConcern"));

    $('#dropdown2Title h6').text(selection2);
    $('#disasters').data('chartObj', c3BarLineChart(dates, dropdown2DataMapping[select2Value].data, "disasters"));

    $('#dropdown3Title h6').text(selection3);
    $('#pop').data('chartObj', c3BarLineChart(dates, dropdown3DataMapping[select3Value].data, "pop"));

    $('#moreChart1').on('change',function(){
        selection1 = $('#moreChart1 option:selected').text();
        select1Value = $('#moreChart1 option:selected').val();
        $('#dropdown1Title h6').text(selection1);
        $('#peopleConcern').data('chartObj', c3BarLineChart(dates, dropdown1DataMapping[select1Value].data, "peopleConcern"));
    });

    $('#moreChart2').on('change',function(){
        selection2 = $('#moreChart2 option:selected').text();
        select2Value = $('#moreChart2 option:selected').val();
        $('#dropdown2Title h6').text(selection2);
        $('#disasters').data('chartObj', c3BarLineChart(dates, dropdown2DataMapping[select2Value].data, "disasters"));
    });

    $('#moreChart3').on('change',function(){
        selection3 = $('#moreChart3 option:selected').text();
        select3Value = $('#moreChart3 option:selected').val();
        $('#dropdown3Title h6').text(selection3);
        $('#pop').data('chartObj', c3BarLineChart(dates, dropdown3DataMapping[select3Value].data, "pop"));
    });
} //generateDetailsCharts


function generateFundingsCharts(x, req, receiv, lgth) {
    return c3.generate({
        bindto: '#fundings',
        size: {
            height: 190
        },
        color: {
            pattern: [blueColor, redColor, whiteColor]
        },
        data: {
            x: 'x',
            columns: [x, req, receiv, lgth],
            axes: {
                'Consecutive length of appeals': 'y2'
            },
            types: {
                'Funding requested': 'bar',
                'Funding received': 'bar'
            },
            groups: [
                ['Funding requested', 'Funding received']
            ]
        },
        axis: {
            x: {
                tick: {
                    centered: true,
                    outer: false
                }
            },
            y: {
                label: {
                    text: 'US$ million',
                },
                tick: {
                    count: 4,
                    format: d3.format(',.2s'),
                },
                show: true,
                padding: {
                    bottom: 0
                }
            },
            y2: {
                tick: {
                    count: 4,
                    values:[2,5,8,12]

                },
                show: true,
                padding: {
                    bottom: 0
                },
                min: 0
            }
        },
        legend: { hide: false },
        padding: {bottom: 10, top: 10}
        // tooltip:{
        //     format: {
        //         value: function(value, ratio, id ){
        //             var format = (id === 'Funding requested' || id === 'Funding received') ? formatMillion : d3.format("d");
        //             return format(value);
        //         }
        //     }
        // }

    });
} //generateFundingsCharts


function c3BarLineChart(x, b, bind) {
        yLabel = {text : b[0]};

    return c3.generate({
        bindto: '#'+bind,
        size: {
            height: 190,
            width: 400
        },
        color: {
            pattern: [blueColor, redColor]
        },
        data: {
            x: 'x',
            columns: [x, b],
            type: "bar"
        },
        axis: {
            x: {
                tick: {
                    centered: true,
                    outer: false
                }
            },
            y: {
                label: yLabel,
                tick: {
                    count: 4,
                    format: d3.format('.2s'),
                },
                min: 0,
                padding: {
                    bottom: 0
                }
            }
        },
        legend: { hide: true },
        padding: {
            bottom: 0,
        }
    });
} //c3BarLineChart

function countrySelected (country) {
    $('#countrySelected h5').html(country);
} // countrySelected

var lengthCrisisCall = $.ajax({
    type: 'GET',
    url: 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1q8CtQ5WF0k9E6dYiPmYDTRysLmxFfRRJaFuxnDlzPT8%2Fedit%23gid%3D1316844249',
    dataType: 'json',
});

var funding_targetCall = $.ajax({
    type: 'GET',
    url: 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1q8CtQ5WF0k9E6dYiPmYDTRysLmxFfRRJaFuxnDlzPT8%2Fedit%23gid%3D197014187',
    dataType: 'json',
});

var humdevCall = $.ajax({
    type: 'GET',
    url: 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1q8CtQ5WF0k9E6dYiPmYDTRysLmxFfRRJaFuxnDlzPT8%2Fedit%23gid%3D1471518527&force=on',
    dataType: 'json',
});

genF10();
$.when(humdevCall).then(function(humdevArgs) {
    var humdevData = hxlProxyToJSON(humdevArgs);
    genererGraphesDetails(humdevData);

});

function hxlProxyToJSON(input, headers) {
    var output = [];
    var keys = []
    input.forEach(function(e, i) {
        if (i == 0) {
            e.forEach(function(e2, i2) {
                var parts = e2.split('+');
                var key = parts[0]
                if (parts.length > 1) {
                    var atts = parts.splice(1, parts.length);
                    atts.sort();
                    atts.forEach(function(att) {
                        key += '+' + att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2, i2) {
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}

function print_filter(filter) {
    var f = eval(filter);
    if (typeof(f.length) != "undefined") {} else {}
    if (typeof(f.top) != "undefined") {
        f = f.top(Infinity);
    } else {}
    if (typeof(f.dimension) != "undefined") {
        f = f.dimension(function(d) {
            return "";
        }).top(Infinity);
    } else {}
    console.log(filter + "(" + f.length + ") = " + JSON.stringify(f).replace("[", "[\n\t").replace(/}\,/g, "},\n\t").replace("]", "\n]"));
}
// fin