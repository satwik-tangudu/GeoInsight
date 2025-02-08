function drawParallelCoordinates(data) {
    const parsedData = JSON.parse(data);
    const margin = { top: 90, right: 100, bottom: 30, left: 100 }; // Increase top margin to add space for legend
    const width = 790 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const dimensions = Object.keys(parsedData[0]).slice(1);  // Exclude "Country" column
    const color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(parsedData.map(d => d.Country));

    // Setup scales for each dimension based on its data range
    const yScales = {};
    dimensions.forEach(dim => {
        yScales[dim] = d3.scaleLinear()
            .domain(d3.extent(parsedData, d => +d[dim]))
            .range([height, 0]);
    });

    const x = d3.scalePoint()
        .range([0, width])
        .domain(dimensions);

    // Tooltip setup
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#f4f4f4")
        .style("border", "1px solid #d3d3d3")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("visibility", "hidden");

    // Draw the lines for each country
    parsedData.forEach(country => {
        const path = d3.line()(dimensions.map(dim => [x(dim), yScales[dim](country[dim])]));

        svg.append("path")
            .attr("d", path)
            .attr("fill", "none")
            .attr("stroke", color(country.Country))
            .attr("stroke-width", 2.5)  // Increase line thickness
            .attr("opacity", 0.7)
            .on("mouseover", function(event) {
                tooltip.html(`<strong>${country.Country}</strong><br>${dimensions.map(dim => `${dim}: ${country[dim]}`).join("<br>")}`)
                    .style("visibility", "visible");
            })
            .on("mousemove", function(event) {
                tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                tooltip.style("visibility", "hidden");
            });
    });

    // Draw axes and axis labels
    dimensions.forEach(dim => {
        svg.append("g")
            .attr("transform", `translate(${x(dim)},0)`)
            .call(d3.axisLeft(yScales[dim]));

        svg.append("text")
            .attr("y", -10)
            .attr("x", x(dim))
            .style("text-anchor", "middle")
            .text(dim);
    });

    // Create a centered legend above the chart with additional spacing
    const legend = svg.append("g")
        .attr("transform", `translate(${width / 2 - parsedData.length * 40 / 2-100}, -80)`);  // Center the legend and add vertical gap

    const legendItems = legend.selectAll('.legend-item')
        .data(parsedData.map(d => d.Country))
        .enter().append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(${i * 80}, 0)`);  // Horizontal spacing

    legendItems.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .style('fill', d => color(d));

    legendItems.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(d => d)
        .style("font-size", "12px");
}
