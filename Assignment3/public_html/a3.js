// Scatterplot implementation based on http://bl.ocks.org/weiglemc/6185069

/* global d3, rawHands, rawHands_pca */
d3.select(window).on('load', init);

var hands, hands_pca, hands_avg;

function init() {

    $('.outlier').on('mouseover', function () {
        $('#dot-37').addClass('highlighted');
        $('#dot-37').attr('r', '20px');
    });
    $('.outlier').on('mouseout', function () {
        $('#dot-37').removeClass('highlighted');
        $('#dot-37').attr('r', '4.5px');
    });

    initData();
    drawHandChart(0);
    drawPcaChart();
}

function initData() {
    hands = [];

    hands_avg = [];
    for (var i = 0; i < 56; ++i) {
        hands_avg[i] = {x: 0, y: 0};
    }

    for (var i = 0; i < rawHands.length; ++i) {
        hands[i] = [];
        for (var j = 0; j < 56; ++j) {
            hands_avg[j].x += rawHands[i][j];
            hands_avg[j].y += rawHands[i][j + 56];
            hands[i][j] = {
                x: rawHands[i][j],
                y: rawHands[i][j + 56]
            };
        }
    }

    for (var i = 0; i < 56; ++i) {
        hands_avg[i].x /= 40;
        hands_avg[i].y /= hands.length;
    }
}

function getX(d) {
    return d.x;
}

function getY(d) {
    return d.y;
}

function getPCA1(d) {
    return d[0];
}

function getPCA2(d) {
    return d[1];
}

function drawHandChart(handIndex) {
    var smallMargin = 20;
    var margin = 80;

    var chart = d3.select('#chart1');
    chart.selectAll('*').remove();
    var width = parseInt(chart.style('width'));
    var height = parseInt(chart.attr('height'));

    var xScale = d3.scale.linear().range([margin, width - smallMargin])
            .domain([
                d3.min(hands[handIndex], getX) - .1,
                d3.max(hands[handIndex], getX) + .1]);

    var yScale = d3.scale.linear().range([height - margin, smallMargin])
            .domain([
                d3.min(hands[handIndex], getY) - .1,
                d3.max(hands[handIndex], getY) + .1]);
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
            .append('text');

    chart.append('svg:g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin + ', 0)')
            .call(yAxis);

    chart.selectAll(".dot")
            .data(hands[handIndex])
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 4.5)
            .attr("cx", function (d) {
                return xScale(getX(d));
            })
            .attr("cy", function (d) {
                return yScale(getY(d));
            });

    var line = d3.svg.line()
            .x(function (d) {
                return xScale(getX(d));
            })
            .y(function (d) {
                return yScale(getY(d));
            }).interpolate("linear");

    chart.append("path")
            .attr("d", function (d) {
                return line(hands[handIndex]);
            }).attr("transform", "translate(0,0)")
            .style("stroke-width", 2)
            .style("stroke", "steelblue")
            .style("fill", "none");
}

function drawPcaChart() {
    var smallMargin = 20;
    var margin = 80;

    var tooltip = d3.select('.tooltip');
    var chart = d3.select('#chart2');
    var width = parseInt(chart.style('width'));
    var height = parseInt(chart.attr('height'));

    var xScale = d3.scale.linear().range([margin, width - smallMargin])
            .domain([
                d3.min(hands_pca, getPCA1) - .1,
                d3.max(hands_pca, getPCA1) + .1]);

    var yScale = d3.scale.linear().range([height - margin, smallMargin])
            .domain([
                d3.min(hands_pca, getPCA2) - .1,
                d3.max(hands_pca, getPCA2) + .1]);
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
            .text('First PCA component');

    chart.append('svg:g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin + ', 0)')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2 + 2 * margin)
            .attr('y', -margin / 2)
            .style('text-anchor', 'end')
            .text('Second PCA component');

    chart.selectAll(".dot")
            .data(hands_pca)
            .enter().append("circle")
            .attr("class", "dot pcadot")
            .attr("id", function (d, index) {
                return "dot-" + index;
            })
            .attr("r", 4.5)
            .attr("cx", function (d) {
                return xScale(getPCA1(d));
            })
            .attr("cy", function (d) {
                return yScale(getPCA2(d));
            })
            .on("mouseover", function (d, index) {
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip.html('Hand nr.: ' + (index + 1) + '<br />\
                              First component: ' + getPCA1(d) + '<br />\
                              Second component:' + getPCA2(d))
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
            })
            .on("click", function (d, index) {
                drawHandChart(index);
            });
    ;
}
