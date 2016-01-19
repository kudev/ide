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

var bisector = d3.bisector(function (d) {
    return new Date(d.date);
}).left;

function init() {
    var smallMargin = 10;
    var margin = 50;
    var svg = d3.select('#chart');
    var width = parseInt(svg.style('width'));
    var height = parseInt(svg.style('height'));
    var tooltip = d3.select('.tooltip');
    var xScale = d3.time.scale()
            .range([margin, width - smallMargin])
            .domain([
                d3.min(data, getX),
                d3.max(data, getX)]);
    var yScale = d3.scale.linear()
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
            .attr('y', margin - smallMargin)
            .text('Date');
    svg.append('svg:g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + margin + ', 0)')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2 + margin)
            .attr('y', -margin / 2)
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

        var dateString = date.getFullYear() + '-' + (pad(date.getMonth() + 1)) + '-' + pad(date.getDate());
        focus.select("circle.y")
                .attr("transform", "translate(" + xScale(date) + "," + yScale(getY(d)) + ")");
        tooltip.html('<table><tr><td>Date:</td><td>' + dateString + '</td></tr>\
                        <td>Value:</td><td>' + getY(d) + '</td></tr></table>');
    }

    var drawLine = d3.svg.line()
        .x(function (d) { return xScale(getX(d)); })
        .y(function (d) { return yScale(getY(d)); })
        .interpolate('basis');

    chart.append('svg:path')
            .attr('d', drawLine(data))
            .attr('class', 'line');
    
    function drawEvents() {
        chart.selectAll("dot").data(events)
            .enter().append("circle")
            .attr("class", "event")
            .attr("r", 10)
            .attr("cx", function (d) { return xScale(getX(d)); })
            .attr("cy", function () { return height - 2*margin; })
            .on("click", function(d, index) {
                //Zooms in, where's the 'drag' stuff to move the camera?
                zoom.translate([1, 1]);
                //alert(events[index].description);
            });
    };

    function gotoEvent(index) {
        alert(events[index].description);

    }
    
    drawEvents();
    
    chart.selectAll("dot")
           .data(events)
           .enter().append("circle")
           .attr("class", "event")
           .attr("r", 10)
           .attr("cx", function (d) { return xScale(getX(d)); })
           .attr("cy", function () { return height - 2*margin; });
    
    function onZoom() {
        var tx = Math.min(0, d3.event.translate[0]);
        var ty = Math.min(0, d3.event.translate[1]);
        zoom.translate([tx, ty]);
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
        svg.select(".line").attr("transform", "translate(" + [tx, ty] + ")scale(" + d3.event.scale + ")");
        chart.selectAll("circle").remove();
        drawEvents();
    }

    var zoom = d3.behavior.zoom()
            .x(xScale)
            .y(yScale)
            .scaleExtent([1, 10])
            .on("zoom", onZoom);
    svg.call(zoom);
}

d3.select(window).on('load', init);