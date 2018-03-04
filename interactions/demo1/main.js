var height = 400;
var width = 600;
var margin = 30;


var chart = d3.select('#interaction')
    .append('svg')
    .attr('width', width + 2*margin+400)
    .attr('height', height + 2*margin)
    .append('g')
    .attr('transform', 'translate('+margin+','+margin+')');

var x = d3.scaleLinear().range([0, width]).domain([2003, 2014]);
var y = d3.scaleLinear().range([height, 0]).domain([0, 100]);

var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);

chart.append("g")
    .attr("class", "y axis")
    // .attr("transform", "translate("  + ",0)")
    .call(yAxis);
chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0,"+height+")")
    .call(xAxis);

d3.json('filtered.json', function(error, data) {
    console.log('DATA', data);
    var categories = [];
    var series = [];
    var selected_category = null;
    var total = null;

    for (var d of data) {
        var is_avg = d.kind == 'avg';
        var is_selected = d.category=='מיגדור מקצועי';
        var is_total = d.kind == 'total';

        if (is_avg) {
            categories.push(d);
        }
        if (is_selected) {
            if (is_avg) {
                selected_category = d;
            } else {
                series.push(d);
            }
            d.color = 'cat1';
        } else {
            d.color = d.category == 'השכלה' ? 'cat2' : 'cat3';
        }
        if (is_total) {
            d.color = 'total';
            total = d;
        }
    }
    console.log('TOTAL', total);
    console.log('CATEGORIES', categories);
    console.log('SELECTED', selected_category);
    console.log('SERIES', series);

    var line = d3.line()
		.x(function (d) { return x(d.year); })
		.y(function (d) { return y(d.score); });
		// .interpolate("linear")

    function update(avg, data, dissolve, collapse_to) {
        var paths = chart.selectAll('g.line')
            .data(data.concat([avg]), function(d) { return d.key; });
        newPaths = paths.enter()
            .append('g')
            .attr('class', function(d) { return 'line '+ d.kind + ' ' + d.color; })
        newPaths.append('path')
            .attr('d', function(d) { return line(avg.values); })
            .style('opacity', function(d) { return d != avg ? 1 : 0; })
            .transition()
            .duration(1000)
            .style('opacity', 1.0)
            .attr('d', function(d) { return line(d.values); });
        newPaths.append('text')
            .attr('class', 'label')
            .attr('x', function(d) { return x(2015)+10; })
            .text(function(d) { return '<  ' + d.title; })
            .attr('y', function(d) { return y(avg.values[avg.values.length-1].score); })
            .style('opacity', 0)
            .transition()
            .duration(1000)
            .attr('y', function(d) { return y(d.values[d.values.length-1].score); })
            .style('opacity', 1.0);

        deadPaths = paths.exit();
        collapse_to = collapse_to || avg;
        if (dissolve) {
            console.log('dissolving');
            deadPaths.selectAll('path')
                .transition()
                .duration(1000)
                .style('opacity', 0);
            deadPaths.selectAll('text')
                .transition()
                .duration(1000)
                .style('opacity', 0);
        } else {
            deadPaths.selectAll('path')
                .transition()
                .duration(1000)
                .attr('d', function(d) { return line(collapse_to.values); });
            deadPaths.selectAll('text')
                .transition()
                .duration(1000)
                .attr('y', function(d) { return y(collapse_to.values[collapse_to.values.length-1].score); })
                .style('opacity', 0);
        }
        deadPaths
            .transition()
            .duration(1000)
            .remove();
    }

    update(selected_category, series);

    var level = 2;
    d3.select('#series')
        .on('click', function() { 
            console.log('level', level, '->', 2)
            update(selected_category, series, level < 2);
            level = 2;
        });
    d3.select('#categories')
        .on('click', function() { 
            console.log('level', level, '->', 1)
            update(total, categories, level < 1, selected_category);
            level = 1;
        });
    d3.select('#total')
        .on('click', function() { 
            console.log('level', level, '->', 0)
            update(total, [], false);
            level = 0      
        });

    
});

