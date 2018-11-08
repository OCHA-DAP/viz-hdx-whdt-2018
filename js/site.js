// global variables
var blueColor = '#2E619A';
redColor
var redColor = '#CC4B36';

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

function genererF10(data, fundingData) {
    var cf = crossfilter(data);
    var dim = cf.dimension(function(d) {
        return [d['#date+year'], d['#indicator+name']];
    });
    var grp = dim.group().reduceSum(function(d) {
        return d['#indicator+num'];
    }).top(Infinity).sort(sortData);

    var interAarr = ['Number of inter-agency appeals'],
        avgLCArr = ['Average length of crisis'],
        yearArr = ['x', 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
    for (var i = 0; i < grp.length; i++) {
        grp[i].key[1] == 'Average length of crises' ? avgLCArr.push(grp[i].value) : interAarr.push(grp[i].value);
    }

    c3.generate({
        bindto: '#chart',
        data: {
            x: 'x',
            type: 'line',
            columns: [yearArr, avgLCArr, interAarr],
        },
        color: {
            pattern: [blueColor, redColor]
        },
        axis: {
            x: {
                localtime: false,
                tick: {
                    centered: true,
                    outer: false
                }
            },
            y: {
                show: true,
                tick: {
                    count: 3,
                    format: d3.format('.2s'),
                    fit:true
                }
            },
        },
        size: {
            height: 150
        }
    });

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
            tooltip: {contents : tooltip_contents}
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
            d[i].x === 2013 ? message = "Funding requested 1−2 years crises spike due to the beginning of the Syria appeals, the largest in history." : "";
        } else if (ele === 'chart1') {
            d[i].x == 2014 ? message = "Funding in the 3−4 years balloons with the advent of billion-dollar appeals in Syria and South Sudan." :
            d[i].x == 2015 ? message = "Funding in the 3−4 years balloons with the advent of billion-dollar appeals in Syria and South Sudan." : "";
        } else if (ele === 'chart2' || 'chart3') {
            d[i].x ===  2017 ? message = "Funding requested is primarily driven by protracted crises, especially Syria, Somalia, South Sudan and Sudan." : "";
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
        text += "<td class='value'>" + value + "</td>";
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
    crisesGroup = crisesDim.group().reduceSum(function(d) {
        return d['#indicator+length_crisis'];
    });
    crisesChart = dc.barChart('#crises');

    crisesChart
        .width($('.col-md-12').width())
        .height(150)
        .margins({
            top: 0,
            right: 30,
            bottom: 80,
            left: 30
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .colors(blueColor)
        .dimension(crisesDim)
        .group(crisesGroup)
        .brushOn(false);

    crisesChart.renderlet(function(chart) {
        chart.selectAll("rect.bar").on("click", function(d) {
            chart.filter(null).filter(d.data.key).redrawGroup();
            $('.detailCharts').show();
            countrySelected(d.x);
            generateDetailsCharts(crisesDim.filter(d.x).top(Infinity).sort(date_sort));
            // $("#detailCharts").scrollTop(660);
            // console.log(document.getElementsByClassName('detailCharts'))

        })
    });
    crisesChart.render();

} //genererGraphesDetails

function generateDetailsCharts(subData) {
    var pop = ['Population'],
        urbanPop = ['Urban'],
        idps = ['IDPs'],
        idmcIDPs = ['IDPs'],
        refugees = ['Refugees'],
        targeted = ['Targeted'],
        poc = ['Concerned'],
        dates = ['x'],
        lengthCrisis = ['Length of crisis'],
        fundingMet = ['Funded'],
        fundingUnmet = ['Unmet'],
        lifeExp = ['Life expectancy'],
        affDisaster = ['Disasters'],
        affDrougth = ['Drought'],
        affEarthquake = ['Earthquake'],
        affWildfire = ['Wildfire'],
        affFlood = ['Flood'],
        affStorms = ['Storms'],
        affTemp = ['Temperature'],
        affVol = ['volcanoes'],
        affWet = ['Wet'];

    for (d in subData) {
        dates.push(Number(subData[d]['#date+year']));
        lengthCrisis.push(Number(subData[d]['#indicator+length_crisis']));

        pop.push(Number(subData[d]['#population+total']));
        urbanPop.push(Number(subData[d]['#population+urban']));
        targeted.push(Number(subData[d]['#inneed+targeted']));
        poc.push(Number(subData[d]['#inneed+concerned+unhrc']));

        lifeExp.push(Number(subData[d]['#indicator+life_expec']));

        refugees.push(Number(subData[d]['#inneed+refugees+unhrc']));
        idps.push(Number(subData[d]['#inneed+idps+unhrc']));
        idmcIDPs.push(subData[d]['#inneed+idmc+idps']);

        affDisaster.push(Number(subData[d]['#affected+natural_disasters+total']));
        affDrougth.push(Number(subData[d]['#affected+drought+total']));
        affEarthquake.push(Number(subData[d]['#affected+earthquake+total']));
        affWildfire.push(Number(subData[d]['#affected+wildfire+total']));
        affFlood.push(Number(subData[d]['#affected+flood+total']));
        affStorms.push(Number(subData[d]['#affected+storms+total']));
        affTemp.push(Number(subData[d]['#affected+temperature+total']));
        affVol.push(Number(subData[d]['#affected+volcanoes+total']));
        affWet.push(Number(subData[d]['#affected+wet+total']));

        let unfunded = (Number(subData[d]['#funding+requirements']) - Number(subData[d]['#funding+received'])) / Number(subData[d]['#funding+requirements'])
        fundingMet.push(Number(subData[d]['#indicator+requirements_met']).toFixed(2) * 100);
        fundingUnmet.push(Number(unfunded).toFixed(2) * 100);

    } //end for
    $('#refugees').data('chartObj', c3BarLineChart(dates, refugees, lengthCrisis, "Refugees", "Length of crisis", "refugees"));
    $('#idps').data('chartObj', c3BarLineChart(dates, idps, lengthCrisis, "IDPs", "Length of crisis", "idps"));
    $('#idmcIDPs').data('chartObj', c3BarLineChart(dates, idmcIDPs, lengthCrisis, "IDPs", "Length of crisis", "idmcIDPs"));
    $('#pop').data('chartObj', generatePopChart(dates, pop, urbanPop, lengthCrisis));
    $('#fundings').data('chartObj', generateFundingsCharts(dates, fundingMet, fundingUnmet, lengthCrisis));
    $('#target').data('chartObj', c3SimpleBarChart(dates, targeted, 'target'));
    $('#peopleConcern').data('chartObj', c3BarLineChart(dates, poc, lengthCrisis, "PoC", "Length of crisis", "peopleConcern"));
    $('#lifeExp').data('chartObj', generateLifeExpChart(dates,lifeExp, "lifeExp"));
    // $('#affected').data('chartObj', c3SimpleLinechart(dates,affDisaster,affDrougth,affEarthquake,affWildfire,affFlood,affStorms,affTemp,affVol,affWet,"affected"));
} //generateDetailsCharts

function generateLifeExpChart (x, data, bind) {
    return c3.generate({
        bindto: '#' + bind,
        data: {
            x: 'x',
            columns: [x, data],
            type: 'area',
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
                    outer: false
                }
            }
        },
        size: {
            height: 180
        },
        legend: {
            hide: true
        }
    });
} //c3SimpleLinechart

function c3SimpleLinechart (x, data, bind) {
    let cols = [];
    if (arguments.length > 3) {
        for (var i = 0; i < arguments.length-1; i++) {
            cols.push(arguments[i])
        }
    } else {
        cols = [x, arguments[1]];
    }
    return c3.generate({
        bindto: '#' + bind,
        data: {
            x: 'x',
            columns: cols,
            type: 'line',
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
                    outer: false
                }
            }
        },
        size: {
            height: 180
        },
        legend: {
            hide: true
        }
    });
} //c3SimpleLinechart

function c3SimpleBarChart(x, data, bind) {
    return c3.generate({
        bindto: '#' + bind,
        data: {
            x: 'x',
            columns: [x, data],
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
                    outer: false
                }
            }
        },
        size: {
            height: 180
        },
        legend: { hide: true }
    });
} //c3SimpleBarChart

function generateFundingsCharts(x, funded, unfunded, lgth) {
    return c3.generate({
        bindto: '#fundings',
        size: {
            height: 180
        },
        color: {
            pattern: [blueColor, redColor, redColor]
        },
        data: {
            x: 'x',
            columns: [x, funded, unfunded, lgth],
            axes: {
                'Length of crisis': 'y2'
            },
            types: {
                'Funded': 'bar',
                'Unmet': 'bar'
            },
            groups: [
                ['Funded', 'Unmet']
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
                // label: {
                //     text: 'Population',
                // },
                tick: {
                    count: 4,
                    format: d3.format('.3s'),
                },
                show: false,
                padding: {
                    bottom: 0
                }
            },
            y2: {
                // label: {
                //     text: 'Urban',
                // },
                tick: {
                    count: 4,
                    format: d3.format('.1s'),
                },
                show: false,
                padding: {
                    bottom: 0
                },
                show: true
            }
        },
        legend: { hide: true }

    });
} //generateFundingsCharts

function generatePopChart(dates, pop, urban, lgth) {
    return c3.generate({
        bindto: '#pop',
        size: {
            height: 180,
            width: 400
        },
        color: {
            pattern: [blueColor, redColor, redColor]
        },
        data: {
            x: 'x',
            columns: [dates, pop, urban, lgth],
            axes: {
                'Length of crisis': 'y2'
            },
            types: {
                'Urban': 'bar',
                'Population': 'bar'
            }
        },
        axis: {
            x: {
                tick: {
                    centered: true,
                    outer: false
                }
            },
            y: {
                // label: {
                //     text: 'Population',
                // },
                tick: {
                    count: 4,
                    format: d3.format('.3s'),
                },
                min: 0,
                padding: {
                    bottom: 0
                }
            },
            y2: {
                // label: {
                //     text: 'Urban',
                // },
                tick: {
                    count: 4,
                    format: d3.format('.1s'),
                },
                // min: 0,
                padding: {
                    bottom: 0
                },
                show: true
            }
        },
        legend: { hide: true }
    });
} //generatePopChart

function c3BarLineChart(x, b, l, barLabel, lineLabel, bind) {
    let typeDefinition,
        axesDefinition;

    if (b[0] === "IDPs") {
        typeDefinition = {
            "IDPs": 'bar'
        };
    } else if (b[0] === "Refugees") {
        typeDefinition = {
            "Refugees": 'bar'
        };
    }else if (b[0] === "Concerned") {
        typeDefinition = {
            "Concerned": 'bar'
        };
    }

    if (lineLabel === "Length of crisis") {
        axesDefinition = {
            "Length of crisis": 'y2'
        }
    }

    return c3.generate({
        bindto: '#'+bind,
        size: {
            height: 180,
            width: 400
        },
        color: {
            pattern: [blueColor, redColor]
        },
        data: {
            x: 'x',
            columns: [x, b, l],
            axes: axesDefinition,
            types: typeDefinition
        },
        axis: {
            x: {
                tick: {
                    centered: true,
                    outer: false
                }
            },
            y: {
                // label: {
                //     text: barLabel,
                //     // position: 'outer-middle'
                // },
                tick: {
                    count: 4,
                    format: d3.format('.3s'),
                },
                min: 0,
                padding: {
                    bottom: 0
                }
            },
            y2: {
                // label: {
                //     text: lineLabel,
                // },
                tick: {
                    count: 4,
                    format: d3.format('.1s'),
                },
                padding: {
                    bottom: 0
                },
                show: true
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

$.when(lengthCrisisCall, funding_targetCall, humdevCall).then(function(lengthCrisisArgs, funding_targetArgs, humdevArgs) {
    var lengthCrisisData = hxlProxyToJSON(lengthCrisisArgs[0]);
    var funding_targetData = hxlProxyToJSON(funding_targetArgs[0]);
    var humdevData = hxlProxyToJSON(humdevArgs[0]);
    genererF10(lengthCrisisData, funding_targetData);


});

$.when(humdevCall).then(function(humdevArgs) {
    var humdevData = hxlProxyToJSON(humdevArgs);
    genererGraphesDetails(humdevData)

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