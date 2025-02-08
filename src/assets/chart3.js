function drawStackedBarChart(data) {
    const margin = {top: 20, right: 130, bottom: 60, left: 60}; // Increased right margin
    const width = 700 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select('#bar-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.Year).sort())
        .range([0, width])
        .paddingInner(0.2)
        .paddingOuter(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Brazil + d.China + d.India + d.Russia + d['Saudi Arabia'])])
        .nice()
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(['Brazil', 'China', 'India', 'Russia', 'Saudi Arabia'])
        .range(d3.schemeCategory10);

    const stack = d3.stack()
        .keys(['Brazil', 'China', 'India', 'Russia', 'Saudi Arabia']);

    const stackedData = stack(data);

    // Data join for the stacked bars
    svg.append('g')
        .selectAll('g')
        .data(stackedData)
        .join('g')
        .attr('fill', d => color(d.key))
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('x', d => x(d.data.Year) + (x.bandwidth() - x.bandwidth() * 0.6) / 2)
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('width', x.bandwidth() * 0.6) // Reduced bar width
        .on('mouseover', function(event, d) {
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip.html(`Year: ${d.data.Year}<br/>Country: ${d3.select(this.parentNode).datum().key}<br/>Value: ${d[1] - d[0]}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mousemove', function(event) {
            tooltip.style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            tooltip.transition().duration(500).style('opacity', 0);
        });

    // Y-axis
    svg.append('g')
        .call(d3.axisLeft(y));

    // X-axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));



    // X-axis label
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .text('Time Period');

    // Y-axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .text('Fertility Rate (Live Births per Woman)');

    // Create a tooltip div (invisible by default)
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#f4f4f4")
        .style("border", "1px solid #d3d3d3")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("font-size", "12px")
        .style("opacity", 0);

    // Move the legend outside the chart area
    const legend = svg.append("g")
        .attr("transform", `translate(${width + 20}, 0)`); // Moved to the right of the chart

    const legendItems = legend.selectAll('.legend-item')
        .data(color.domain())
        .enter().append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItems.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', color);

    legendItems.append('text')
        .attr('x', 24)
        .attr('y', 14)
        .text(d => d);
}

