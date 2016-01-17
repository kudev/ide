/* global d3, data */

d3.select(window).on('load', init);

function getX(d) {
    return d.date;
}

function getY(d) {
    return d.open;
}

function init() {
    var smallMargin = 20;
    var margin = 80;

    var chart = d3.select('#chart1');
    var width = parseInt(chart.style('width'));
    var height = parseInt(chart.attr('height'));

    var tooltip = d3.select('.tooltip');

    var xScale = d3.scale.linear().range([margin, width - smallMargin])
            .domain([
                d3.min(data, getX),
                d3.max(data, getX)]);

    var yScale = d3.scale.linear().range([height - margin, smallMargin])
            .domain([
                d3.min(data, getY) - .001,
                d3.max(data, getY) + .001]);
    var xAxis = d3.svg.axis()
            .outerTickSize(-height + margin + smallMargin)
            .scale(xScale);
    var yAxis = d3.svg.axis()
            .innerTickSize(-width + margin + smallMargin).outerTickSize(-width + margin + smallMargin)
            .scale(yScale)
            .orient('left');

    chart.append('svg:g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0, ' + (height - margin) + ')')
            .call(xAxis)
            .append('text')
            .attr('x', width / 2)
            .attr('y', margin - smallMargin)
            .text('Year');

    chart.append('svg:g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin + ', 0)')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2 + margin)
            .attr('y', -margin / 2)
            .style('text-anchor', 'end')
            .text('Temperature (°C)');

    chart.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("id", function (d) {
                return d.date;
            })
            .attr("r", 5)
            .attr("cx", function (d) {
                return xScale(getX(d));
            })
            .attr("cy", function (d) {
                return yScale(getY(d));
            })
            .on("mouseover", function (d, index) {
                tooltip
                        .transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip
                        .html('<table><tr><td>Date:</td><td>' + getX(d) + '</td></tr>\
                              <td>Value:</td><td>' + getY(d) + '</td></tr></table>')
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
            });

    var drawLine = d3.svg.line()
            .x(function (d) {
                return xScale(getX(d));
            })
            .y(function (d) {
                return yScale(getY(d));
            })
            .interpolate('basis');

    chart.append('svg:path')
            .attr('d', drawLine(data))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

    // TREND LINE BELOW
    // Based on http://bl.ocks.org/rkirsling/33a9e350516da54a5d4f
    // 
    // get the x and y values for least squares
    var xLabels = data.map(getX);
    var xSeries = d3.range(1, xLabels.length + 1);
    var ySeries = data.map(getY);

    var leastSquaresCoeff = leastSquares(xSeries, ySeries);
    // apply the reults of the least squares regression
    var x1 = xLabels[0];
    var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
    var x2 = xLabels[xLabels.length - 1];
    var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
    var trendData = [[x1, y1, x2, y2]];

    var trendline = chart.selectAll(".trendline")
            .data(trendData);

    trendline.enter()
            .append("line")
            .attr("class", "trendline")
            .attr("x1", function (d) {
                return xScale(d[0]);
            })
            .attr("y1", function (d) {
                return yScale(d[1]);
            })
            .attr("x2", function (d) {
                return xScale(d[2]);
            })
            .attr("y2", function (d) {
                return yScale(d[3]);
            })
            .attr("stroke", "black")
            .attr("stroke-width", 1);

    // display equation on the chart
    chart.append("text")
            .attr("class", "text-label")
            .attr("x", function (d) {
                return xScale(x2) - 60;
            })
            .attr("y", function (d) {
                return yScale(y2) - 30;
            });

    // display r-square on the chart
    chart.append("text")
            .attr("class", "text-label")
            .attr("x", function (d) {
                return xScale(x2) - 60;
            })
            .attr("y", function (d) {
                return yScale(y2) - 10;
            });
}

// http://bl.ocks.org/rkirsling/33a9e350516da54a5d4f
// returns slope, intercept and r-square of the line
function leastSquares(xSeries, ySeries) {
    var reduceSumFunc = function (prev, cur) {
        return prev + cur;
    };

    var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

    var ssXX = xSeries.map(function (d) {
        return Math.pow(d - xBar, 2);
    })
            .reduce(reduceSumFunc);

    var ssYY = ySeries.map(function (d) {
        return Math.pow(d - yBar, 2);
    })
            .reduce(reduceSumFunc);

    var ssXY = xSeries.map(function (d, i) {
        return (d - xBar) * (ySeries[i] - yBar);
    })
            .reduce(reduceSumFunc);

    var slope = ssXY / ssXX;
    var intercept = yBar - (xBar * slope);
    var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

    return [slope, intercept, rSquare];
}
