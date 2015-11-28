/* global d3, data */

d3.select(window).on('load', init);

function init(){
    var margin = 50;

    var chart = d3.select('#chart');
    var width = chart.attr('width');
    var height = chart.attr('height');
    
    var xScale = d3.scale.linear().range([margin, width - margin])
            .domain([
        d3.min(data, function (d) { return d.YEAR; }),
        d3.max(data, function (d) { return d.YEAR; })]);
    var yScale = d3.scale.linear().range([height - margin, margin])
            .domain([
        d3.min(data, function (d) { return d.metANN; }),
        d3.max(data, function (d) { return d.metANN; })]);
    var xAxis = d3.svg.axis()
            .scale(xScale);
    var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

    chart.append('svg:g')
            .attr('transform', 'translate(0, ' + (height - margin) + ')')
            .call(xAxis);

    chart.append('svg:g')
            .attr('transform', 'translate(' + margin + ', 0)')
            .call(yAxis);

    var drawLine = d3.svg.line()
        .x(function(d) {
          return xScale(d.YEAR);
        })
        .y(function(d) {
          return yScale(d.metANN);
        })
        .interpolate('linear');

        chart.append('svg:path')
            .attr('d', drawLine(data))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
}