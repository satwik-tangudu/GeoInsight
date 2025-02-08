function drawSunburstChart(data) {
    const parsedData = JSON.parse(data);

    // Prepare hierarchical data for sunburst
    const hierarchyData = {
        name: "Infectious Diseases",
        children: []
    };

    const countryMap = new Map();
    parsedData.forEach(d => {
        if (!countryMap.has(d.Country)) {
            countryMap.set(d.Country, { name: d.Country, children: [] });
        }
        const countryNode = countryMap.get(d.Country);
        
        let yearNode = countryNode.children.find(y => y.name === d.Year);
        if (!yearNode) {
            yearNode = { name: d.Year, children: [] };
            countryNode.children.push(yearNode);
        }

        yearNode.children.push({
            name: d.Disease,
            value: d["Percent of Patients"]
        });
    });

    hierarchyData.children = Array.from(countryMap.values());

    const margin = { top: 40, right: 10, bottom: 40, left: 40 };
    const width = 700 - margin.left - margin.right;
    const radius = width / 2;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", width + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${width / 2 + 50}, ${width / 2 + margin.top})`);

    const partition = d3.partition()
        .size([2 * Math.PI, radius * radius]);

    const root = d3.hierarchy(hierarchyData)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    partition(root);

    // Adjust inner radius for reduced white center
    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .innerRadius(d => Math.sqrt(d.y0))  // Decreased inner radius
        .outerRadius(d => Math.sqrt(d.y1));

    const colors = {
        "Brazil": ["#4E79A7", "#7BA3CD", "#AFC8E0"],
        "China": ["#F28E2B", "#F6B374", "#F9CBA6"],
        "India": ["#59A14F", "#8DC086", "#B6D7B4"],
        "Russia": ["#E15759", "#EA898B", "#F1B8BA"],
        "Saudi Arabia": ["#B07AA1", "#C8A3C0", "#DDC2D8"]
    };

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-size", "25px")
        .style("font-weight", "bold")
        .text("Infectious Diseases");

    svg.selectAll("path")
        .data(root.descendants())
        .enter().append("path")
        .attr("display", d => d.depth ? null : "none")
        .attr("d", arc)
        .style("stroke", "#fff")
        .style("fill", d => {
            const country = d.ancestors().find(p => p.depth === 1)?.data.name;
            if (!country) return "#ddd";
            return colors[country][d.depth - 1];
        })
        .on("mouseover", function (event, d) {
            const tooltipContent = `${d.ancestors().map(p => p.data.name).reverse().join(" -> ")}: ${d.value}%`;
            d3.select("#tooltip")
                .html(tooltipContent)
                .style("visibility", "visible")
                .style("top", `${event.pageY - 10}px`)
                .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", () => d3.select("#tooltip").style("visibility", "hidden"));

    // Text labels with improved readability
    svg.selectAll("text")
        .data(root.descendants())
        .enter().append("text")
        .attr("transform", function(d) {
            const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
            const y = (Math.sqrt(d.y0 + radius * 0.15) + Math.sqrt(d.y1)) / 2;
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        })
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text(d => d.depth === 1 ? d.data.name : d.depth === 2 ? d.data.name : "");

    // Tooltip
    d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "#f4f4f4")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "4px");
}

