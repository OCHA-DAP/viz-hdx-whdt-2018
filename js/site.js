function func (data) {
    var cf = crossfilter(data);

    var dm = cf.dimension(function(d){
        return d['#country+name'];
    });

    var chart = dc.barChart('#chart').width(800).height(400)
            .dimension(dm)
            .group(dm.group().reduceSum(function(d){ return d['#population+total']; }))
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .xAxis().ticks(5);
    dc.renderAll();
} // fin func

var dataCall = $.ajax({
    type: 'GET',
    url: 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1d6sfezP3DEfuQuTWzUHU3Q-F6vWjfNwYwIN9RRo3NhU%2Fedit%23gid%3D2126220157',
    dataType: 'json',
});

$.when(dataCall).then(function (dataArgs) {
    var data = hxlProxyToJSON(dataArgs);
    func(data)
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