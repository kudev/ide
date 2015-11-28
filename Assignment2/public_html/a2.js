/* global d3, data */

d3.select(window).on('load', init);

function getX(d) {
    return d.YEAR;
}

function getY(d) {
    var value = d.metANN;
    return value === 999.9 ? undefined : value;
}

function init(){
    var margin = 50;

    var chart = d3.select('#chart');
    var width = chart.attr('width');
    var height = chart.attr('height');
    
    var xScale = d3.scale.linear().range([margin, width - margin])
            .domain([
        d3.min(data, getX),
        d3.max(data, getX)]);

    var yScale = d3.scale.linear().range([height - margin, margin])
            .domain([
        d3.min(data, getY),
        d3.max(data, getY)]);
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
            return xScale(getX(d));
        })
        .y(function(d) {
            return yScale(getY(d));
        })
        .interpolate('basis');

    chart.append('svg:path')
        .attr('d', drawLine(data))
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
}