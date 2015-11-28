// Scatterplot implementation based on http://bl.ocks.org/weiglemc/6185069

function getValue(d) {
    var value = d.metANN;
    return value === 999.9 ? undefined : value;
}

function getCph(d) {
    var value = d.cph.metANN;
    return value === 999.9 ? -5000 : value;
}

function getGreenland(d) {
    var value = d.greenland.metANN;
    return value === 999.9 ? -5000 : value;
}

function initChart2() {
    var smallMargin = 20;
    var margin = 80;

    var tooltip = d3.select('.tooltip');
    var chart = d3.select('#chart2');
    var width = parseInt(chart.style('width'));
    var height = parseInt(chart.attr('height'));

    var xScale = d3.scale.linear().range([margin, width - smallMargin])
            .domain([
                d3.min(data1, getValue) - 1,
                d3.max(data1, getValue) + 1]);

    var yScale = d3.scale.linear().range([height - margin, smallMargin])
            .domain([
                d3.min(data2, getValue) - 1,
                d3.max(data2, getValue) + 1]);
    var xAxis = d3.svg.axis()
            .outerTickSize(-height + margin + smallMargin)
            .innerTickSize(-height + margin + smallMargin)
            .scale(xScale);
    var yAxis = d3.svg.axis()
            .innerTickSize(-width + margin + smallMargin)
            .outerTickSize(-width + margin + smallMargin)
            .scale(yScale)
            .orient('left');

    chart.append('svg:g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0, ' + (height - margin) + ')')
            .call(xAxis)
            .append('text')
            .attr('x', width / 2 - margin)
            .attr('y', margin - smallMargin)
            .text('Temperature in Copenhagen (°C)');

    chart.append('svg:g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin + ', 0)')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2 + 2 * margin)
            .attr('y', -margin / 2)
            .style('text-anchor', 'end')
            .text('Temperature in Egedesminde (°C)');

    var dataMerged = [];
    for (var i = 0; i < data1.length; ++i) {
        dataMerged[i] = {
            cph: data1[i],
            greenland: data2[i]
        };
    }
    chart.selectAll(".dot")
            .data(dataMerged)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 4.5)
            .attr("cx", function (d) {
                return xScale(getCph(d));
            })
            .attr("cy", function (d) {
                return yScale(getGreenland(d));
            })
            .on("mouseover", function (d) {
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip.html('Year: ' + d.cph.YEAR + '<br />\
                             Copenhagen:' + getCph(d) + '<br />\
                             Egedesminde: ' + getGreenland(d))
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
            });
}
