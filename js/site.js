// global variables
var blueColor = '#2E619A';redColor
var redColor = '#CC4B36' ;

var sortData = function (d1, d2) {
    if (d1.key > d2.key) return 1;
    if (d1.key < d2.key) return -1;
    return 0;
};

function genererF10 (data, fundingData) {
    var cf = crossfilter(data);
    var dim = cf.dimension(function(d){ return [d['#date+year'], d['#indicator+name']]; });
    var grp = dim.group().reduceSum(function(d){ return d['#indicator+num'];}).top(Infinity).sort(sortData);

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
                }
            },
        },
        size: {height: 150}
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
    var dimF = ndx.dimension(function(d){ return [d['#date+year'],d['#indicator+name'],d['#indicator+length']]; });
    var groupF = dimF.group().reduceSum(function(d){ return d['#indicator+num']; }).top(Infinity).sort(sortData);

    for (var i = 0; i < groupF.length; i++) {
        if (groupF[i].key[1] == "funding requested") {
            groupF[i].key[2] == "1-2years" ? fundingRq12.push(groupF[i].value):
            groupF[i].key[2] == "3-4years" ? fundingRq34.push(groupF[i].value):
            groupF[i].key[2] == "5-6years" ? fundingRq56.push(groupF[i].value): fundingRq7.push(groupF[i].value);
        } else {
            if (groupF[i].key[1] == "funding received") {
                groupF[i].key[2] == "1-2years" ? fundingRcv12.push(groupF[i].value):
                groupF[i].key[2] == "3-4years" ? fundingRcv34.push(groupF[i].value):
                groupF[i].key[2] == "5-6years" ? fundingRcv56.push(groupF[i].value): fundingRcv7.push(groupF[i].value);
            } else {
                groupF[i].key[2] == "1-2years" ? target12.push(groupF[i].value):
                groupF[i].key[2] == "3-4years" ? target34.push(groupF[i].value):
                groupF[i].key[2] == "5-6years" ? target56.push(groupF[i].value): target7.push(groupF[i].value);
            }
        }
    }
    var fundingsReq = [fundingRq12,fundingRq34,fundingRq56,fundingRq7],
        fundingsRecv= [fundingRcv12,fundingRcv34,fundingRcv56,fundingRcv7],
        targets = [target12, target34, target56, target7],
        targetedArr = ['x', 2011, 2012, 2013, 2014, 2015, 2016, 2017],
        titles = ["1-2 Years", "3-4 Years", "5-6 Years", "More than 7 Years"];
    for (var i = 0; i < 4; i++) {
        $('.charts').append('<div class="header"><strong>'+titles[i]+'</strong></div><div class="col-md-6 col-sm-12" id="chart'+i+'"></div><div class="col-md-6 col-sm-12" id="chartp'+i+'"></div>');
        var chartF = c3.generate({
            bindto: '#chart'+i,
            data: {
                x: 'x',
                columns: [yearArr, fundingsReq[i], fundingsRecv[i]],
                type: 'bar'
            },
            color:{
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
            size: {height: 150},
            legend : {hide: false}
        });
        var chartP = c3.generate({
            bindto: '#chartp'+i,
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
                        outer: false
                    }
                }
            },
            size: {height: 150},
            legend : {hide: true}
        });
        $('#chartp'+i).data('chartObj', chartP);
    }
} //genererF10

function genererGraphesDetails (data) {
    var cf = crossfilter(data);
    var crisesDim,
        crisesGroup,
        crisesChart;
    crisesDim = cf.dimension(function(d){ return d['#country+name'];});
    crisesGroup = crisesDim.group().reduceSum(function(d){ return d['#indicator+length_crisis'];});

    crisesChart = dc.barChart('#crises')
                    .width($('.col-md-12').width())
                    .height(180)
                    .margins({ top: 0, right: 20, bottom: 80, left: 0 })
                    .dimension(crisesDim)
                    .group(crisesGroup)
                    .x(d3.scale.ordinal())
                    .xUnits(dc.units.ordinal)
                    .elasticY(true)
                    .colors(blueColor);
    var composite = dc.compositeChart('#killed');

    var yearDim = cf.dimension(function(d){ return d['#date+year'];}),
        lengthCrisisDim = cf.dimension(function(d){ return [d['#date+year'], d['#indicator+length_crisis'],d['#inneed+total']]; });

    var unhrcIDPgrp = yearDim.group().reduceSum(function(d){ return d['#inneed+idps+unhrc'];}),
        unhrcRefgrp = yearDim.group().reduceSum(function(d){ return d['#inneed+refugees+unhrc'];}),
        populationgrp = yearDim.group().reduceSum(function(d){ return d['#population+total'];}),
        hdiScoregrp = yearDim.group().reduceSum(function(d){ return d['#indicator+hdi'];}),
        schoolCompletiongrp = yearDim.group().reduceSum(function(d){ return d['#indicator+primary_completion'];}),
        lengthCrisisgrp = lengthCrisisDim.group().reduceSum(function(d){ return d['#inneed+total']; });

    var naturalDisastersKil = yearDim.group().reduceSum(function(d){ return d['#indicator+killed+natural_disasters'];}),
        droughtKil = yearDim.group().reduceSum(function(d){ return d['#indicator+killed+drought'];}),
        earthquakeKil = yearDim.group().reduceSum(function(d){ return d['#indicator+killed+earthquake'];}),
        wildfireKil = yearDim.group().reduceSum(function(d){ return d['#indicator+killed+wildfire'];}),
        floodKil = yearDim.group().reduceSum(function(d){ return d['#indicator+killed+flood'];}),
        stormKil = yearDim.group().reduceSum(function(d){ return d['#indicator+killed+storms'];}),
        tempKil = yearDim.group().reduceSum(function(d){ return d['#indicator+killed+temperature'];}),
        volcanoeKill = yearDim.group().reduceSum(function(d){ return d['#indicator+killed+volcanoes'];}),
        wetKil = yearDim.group().reduceSum(function(d){ return d['#indicator+killed+wet'];});

        // for (d in lengthCrisisgrp) {
        //     console.log(lengthCrisisgrp[d])
        // }
        var idpBarChart = dc.barChart('#idp')
            // .width($('.col-md-4').width())
            .width(450)
            .height(200)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .dimension(yearDim)
            .group(unhrcIDPgrp)
            .colors(blueColor)
            .elasticX(true)
            .elasticY(true);

        idpBarChart.yAxis().tickFormat(d3.format('.2s'));

        refugeesBarChart = dc.barChart('#refugees')
            .width(450)
            .height(200)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .dimension(yearDim)
            .group(unhrcRefgrp)
            .colors(blueColor)
            .elasticX(true)
            .elasticY(true);
        refugeesBarChart.yAxis().tickFormat(d3.format('.2s'));

        popBarChart = dc.barChart('#pop')
            .width(450)
            .height(200)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .dimension(yearDim)
            .group(populationgrp)
            .colors(redColor)
            .elasticX(true)
            .elasticY(true);
        popBarChart.yAxis().tickFormat(d3.format('.2s'));

        composite.width(450)
                .height(200)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .dimension(yearDim)
                .compose(
                    [
                    dc.lineChart(composite)
                        .group(naturalDisastersKil)
                        
                        .elasticY(true),
                    dc.lineChart(composite)
                        .group(droughtKil)
                        .dimension(yearDim)
                    ]
                )
                .brushOn(false);

        // dc.bubbleChart('#lengthcrisis')
        //     .width(800)
        //     .height(200)
        //     .dimension(lengthCrisisDim)
        //     .group(lengthCrisisgrp)
        //     .colors(redColor)
        //     .keyAccessor(function (p) {
        //         return parseInt(p.key[0]);
        //     })
        //     .valueAccessor(function (p) {
        //         return parseInt(p.key[1]);
        //     })
        //     .radiusValueAccessor(function (p) {
        //         return p.value;
        //     })
        //     .maxBubbleRelativeSize(0.01)
        //     .x(d3.scale.linear().domain([0, 2020]))
        //     .y(d3.scale.linear().domain([0, 18]))
        //     .r(d3.scale.linear().domain([0, 22000000]))
        //     .elasticX(true)
        //     .elasticY(true);

    dc.renderAll();
} //genererGraphesDetails

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

$.when(lengthCrisisCall, funding_targetCall, humdevCall).then(function (lengthCrisisArgs, funding_targetArgs, humdevArgs) {
    var lengthCrisisData = hxlProxyToJSON(lengthCrisisArgs[0]);
    var funding_targetData = hxlProxyToJSON(funding_targetArgs[0]);
    var humdevData = hxlProxyToJSON(humdevArgs[0]);
    genererF10(lengthCrisisData, funding_targetData);


});

$.when(humdevCall).then(function (humdevArgs) {
    var humdevData = hxlProxyToJSON(humdevArgs);
    genererGraphesDetails(humdevData)

});

function hxlProxyToJSON(input, headers) {
    var output = [];
    var keys = []
    input.forEach(function (e, i) {
        if (i == 0) {
            e.forEach(function (e2, i2) {
                var parts = e2.split('+');
                var key = parts[0]
                if (parts.length > 1) {
                    var atts = parts.splice(1, parts.length);
                    atts.sort();
                    atts.forEach(function (att) {
                        key += '+' + att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function (e2, i2) {
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}

function print_filter(filter) {
    var f = eval(filter);
    if (typeof (f.length) != "undefined") {} else {}
    if (typeof (f.top) != "undefined") {
        f = f.top(Infinity);
    } else {}
    if (typeof (f.dimension) != "undefined") {
        f = f.dimension(function (d) {
            return "";
        }).top(Infinity);
    } else {}
    console.log(filter + "(" + f.length + ") = " + JSON.stringify(f).replace("[", "[\n\t").replace(/}\,/g, "},\n\t").replace("]", "\n]"));
}
// fin