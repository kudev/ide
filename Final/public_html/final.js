/* global d3, data, events */

function getX(d) {
    return new Date(d.date);
}

function getY(d) {
    return d.open;
}

function pad(x) {
    return ("00" + x).substr(("" + x).length);
}

function dateToString(date) {
    return date.getFullYear() + '-' + (pad(date.getMonth() + 1)) + '-' + pad(date.getDate());
}

var bisector = d3.bisector(function (d) {
    return new Date(d.date);
}).left;

var smallMargin = 10;
var margin = 50;
var currentEvent = -1;
var width;
var height;

var svg;
var tooltip;
var sidebar;
var zoom;
var xScale;
var yScale;

function gotoEvent(index) {
    currentEvent = index;

    svg.call(zoom.translate([0,0]).scale(0).event);

    var d = events[index];
    var dx = 100;
    var dy = 50;
    var x = xScale(getX(d));
    var y = yScale(getY(d));
    var scale = .8 / Math.max(dx / width, dy / height);
    var translate = [width / 2 - scale * x, height / 2 - scale * y];

    svg.transition()
       .duration(750)
       .call(zoom.translate(translate).scale(scale).event);
    
    d3.select("#leftarrow").attr("class", currentEvent > 0 ? "arrow" : "arrow invisible");
    d3.select("#rightarrow").attr("class", currentEvent < events.length - 1 ? "arrow" : "arrow invisible");
    sidebar.html(dateToString(getX(d)) + '<br />' + d.description);
}

function init() {
    svg = d3.select('#chart');
    tooltip = d3.select('#tooltip');
    sidebar = d3.select('#sidebar');
    width = parseInt(svg.style('width'));
    height = parseInt(svg.style('height'));
    
    xScale = d3.time.scale()
            .range([margin, width - smallMargin])
            .domain([
                d3.min(data, getX),
                d3.max(data, getX)]);
    yScale = d3.scale.linear()
            .range([height - margin, smallMargin])
            .domain([
                d3.min(data, getY) - .025,
                d3.max(data, getY) + .025]);
    var xAxis = d3.svg.axis()
            .outerTickSize(-height + margin + smallMargin)
            .scale(xScale);
    var yAxis = d3.svg.axis()
            .innerTickSize(-width + margin + smallMargin).outerTickSize(-width + margin + smallMargin)
            .scale(yScale)
            .orient('left');

    svg.append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("x", margin)
            .attr("y", smallMargin)
            .attr("width", width - 2 * smallMargin)
            .attr("height", height - smallMargin - margin);

    var chart = svg.append("g")
            .attr("clip-path", "url(#clip)");

    svg.append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + (height - margin) + ')')
            .call(xAxis)
            .append('text')
            .attr('x', width / 2)
            .attr('y', 40)
            .text('Date');

    svg.append('svg:g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + margin + ', 0)')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2 + margin)
            .attr('y', -35)
            .style('text-anchor', 'end')
            .text('EUR/USD rate');

    var focus = chart.append("g")
            .style("display", "none");
    focus.append("circle")
            .attr("class", "y")
            .style("fill", "none")
            .style("stroke", "blue")
            .attr("r", 5);
    chart.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function () {
                focus.style("display", null);
            })
            .on("mouseout", function () {
                focus.style("display", "none");
            })
            .on("mousemove", mousemove);

    function mousemove() {
        var x0 = xScale.invert(d3.mouse(this)[0]);
        var i = bisector(data, x0);
        var d = data[i];
        var date = getX(d);

        focus.select("circle.y")
            .attr("transform", "translate(" + xScale(date) + "," + yScale(getY(d)) + ")");
        tooltip.html('<table><tr><td>Date:</td><td>' + dateToString(date) + '</td></tr>\
                        <td>Value:</td><td>' + getY(d) + '</td></tr></table>');
    }

    var drawLine = d3.svg.line()
        .x(function (d) { return xScale(getX(d)); })
        .y(function (d) { return yScale(getY(d)); })
        .interpolate('cardinal');

    chart.append('svg:path')
        .attr('d', drawLine(data))
        .attr('class', 'line');
    
    function drawEvents() {
        chart.selectAll("dot").data(events)
            .enter().append("circle")
            .attr("class", "event")
            .attr("id", function (d) { return "event-" + dateToString(getX(d)); })
            .attr("r", 20)
            .attr("cx", function (d) { return xScale(getX(d)); })
            .attr("cy", function () { return height - margin; })
            .on("click", function(d, index) {
                gotoEvent(index);
            });
    }
    
    drawEvents();

    function onZoom() {
        /*var tx = Math.min(0, d3.event.translate[0]);
        var ty = Math.min(0, d3.event.translate[1]);*/
        var tx = d3.event.translate[0];
        var ty = d3.event.translate[1];
        zoom.translate([tx, ty]);
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
        svg.select(".line").attr("transform", "translate(" + [tx, ty] + ")scale(" + d3.event.scale + ")");
        chart.selectAll("circle").remove();
        drawEvents();
    }

    zoom = d3.behavior.zoom()
            .x(xScale)
            .y(yScale)
            .scaleExtent([1, 10])
            .on("zoom", onZoom);
    svg.call(zoom);
    
    d3.select("body").on("keydown", function() {
        var key = d3.event.keyCode;
        if (key === 37) { // LEFT ARROW
            if (currentEvent >= 0) {
                gotoEvent(currentEvent - 1);
            }
        } else if (key === 39) { // RIGHT ARROW
            if (currentEvent < events.length - 1) {
                gotoEvent(currentEvent + 1);
            }
        }
    });

    d3.select("#leftarrow").on("click", function() {
        if (currentEvent >= 0) {
            gotoEvent(currentEvent - 1);
        }
    });
    d3.select("#rightarrow").on("click", function() {
        if (currentEvent < events.length - 1) {
            gotoEvent(currentEvent + 1);
        }
    });
}

d3.select(window).on('load', init);