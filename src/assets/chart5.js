function drawTreemap(data) {
    const parsedData = JSON.parse(data);
    const width = 750;
    const height = 600;

    // Create root hierarchy for treemap with nested data
    const hierarchyData = d3.hierarchy(parsedData)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    const treemapLayout = d3.treemap()
        .size([width, height])
        .padding(1);

    treemapLayout(hierarchyData);

    const svg = d3.select("#treemap")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Color scale for electricity types
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Tooltip setup
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#f4f4f4")
        .style("border", "1px solid #d3d3d3")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("visibility", "hidden");

    // Draw rectangles for each node
    svg.selectAll("rect")
        .data(hierarchyData.leaves())
        .enter().append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => colorScale(d.parent.data.name))
        .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible")
                .html(`Type: ${d.parent.data.name}<br>Country: ${d.data.name}<br>Value: ${d.data.value}`)
                .style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });

    // Add labels to each rectangle
    svg.selectAll("text")
        .data(hierarchyData.leaves())
        .enter().append("text")
        .attr("x", d => (d.x0 + d.x1) / 2)
        .attr("y", d => (d.y0 + d.y1) / 2)
        .attr("text-anchor", "middle")
        .text(d => d.data.name)
        .style("font-size", "10px")
        .style("fill", "#000");
    
    const legend = d3.select("#treemap")
        .append("div")
        .attr("class", "legend")
        .style("display", "flex")
        .style("flex-wrap", "wrap")
        .style("justify-content", "center")
        .style("margin-top", "10px");

    // Get unique electricity types
    const types = hierarchyData.children.map(d => d.data.name); // Get the electricity types

    // Create legend items for each type
    const legendItems = legend.selectAll(".legend-item")
        .data(types)
        .enter()
        .append("div")
        .attr("class", "legend-item")
        .style("display", "flex")
        .style("align-items", "center")
        .style("justify-content", "center")
        .style("margin-right", "10px");

    legendItems.append("span")
        .style("display", "inline-block")
        .style("width", "12px")
        .style("height", "12px")
        .style("background-color", d => colorScale(d))
        .style("margin-right", "5px")
        .style("justify-content", "center");


    legendItems.append("span")
        .text(d => d)
        .style("font-size", "12px");

}
