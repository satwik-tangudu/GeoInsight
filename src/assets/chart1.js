function drawLineChart(data) {
    const parsedData = JSON.parse(data);
    const margin = { top: 30, right: 150, bottom: 50, left: 50 };
    const width = 750 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([2010.5, 2020])
        .range([0, width]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    const y = d3.scaleLinear()
        .domain([0, d3.max(parsedData, d => Math.max(...Object.values(d).slice(1)))])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    const color = d3.scaleOrdinal(d3.schemeCategory10);

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

    // Data join for the lines and circles
    const countries = Object.keys(parsedData[0]).slice(1);

    countries.forEach((country, index) => {
        // Data join for line paths
        const line = d3.line()
            .x(d => x(d.Year))
            .y(d => y(d[country]));

        const path = svg.selectAll(`.line-${country}`)
            .data([parsedData], d => country); // Use country as the key

        path.enter().append("path")
            .attr("class", `line-${country}`)
            .attr("fill", "none")
            .attr("stroke", color(index))
            .attr("stroke-width", 1.5)
            .attr("d", line);

        path.transition().duration(750).attr("d", line); // Update existing paths

        path.exit().remove(); // Remove unnecessary paths

        // Data join for circles
        const circles = svg.selectAll(`.dot-${country}`)
            .data(parsedData, d => d.Year); // Use year as the key for circles

        circles.enter().append("circle")
            .attr("class", `dot-${country}`)
            .attr("cx", d => x(d.Year))
            .attr("cy", d => y(d[country]))
            .attr("r", 3)
            .attr("fill", color(index))
            .on("mouseover", function(event, d) {
                const tooltipContent = `Year: ${d.Year}<br>Country: ${country}<br>Value: ${d[country]}%`;
                tooltip.html(tooltipContent)
                    .style("visibility", "visible")
                    .style("background", "#f4f4f4")
                    .style("border", "1px solid #d3d3d3")
                    .style("border-radius", "5px")
                    .style("padding", "10px")
                    .style("font-size", "12px");
            })
            .on("mousemove", function(event) {
                tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                tooltip.style("visibility", "hidden");
            });

        circles.transition().duration(750)
            .attr("cx", d => x(d.Year))
            .attr("cy", d => y(d[country])); // Update existing circles

        circles.exit().remove(); // Remove old circles
    });

    // X-axis label
    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Year");

    // Y-axis label
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .text("Internet Usage(%)");

    // Vertical legend on the right side
    const legend = svg.append("g")
        .attr("transform", `translate(${width + 40}, 0)`);

    const legendItems = legend.selectAll('.legend-item')
        .data(countries)
        .enter().append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItems.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', (d, i) => color(i));

    legendItems.append('text')
        .attr('x', 24)
        .attr('y', 14)
        .text(d => d);
}


