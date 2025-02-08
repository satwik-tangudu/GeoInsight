function drawForceDirectedGraph(data) {
    const parsedData = JSON.parse(data);
    const width = 1200, height = 600;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Prepare nodes and links with aggregation for multiple weights on the same edge
    const nodes = [];
    const linksMap = {}; // To store unique links with aggregation

    // Extract nodes and aggregate links from data
    parsedData.forEach(d => {
        // Add nodes if they don't exist in the nodes array
        if (!nodes.find(n => n.id === d["Source Country"])) {
            nodes.push({ id: d["Source Country"], type: "country" });
        }
        if (!nodes.find(n => n.id === d["Trade Category"])) {
            nodes.push({ id: d["Trade Category"], type: "category" });
        }

        // Create a unique key for each edge
        const edgeKey = `${d["Source Country"]}-${d["Trade Category"]}`;

        // Aggregate trade volume and migration flow for edges with the same source-target
        if (linksMap[edgeKey]) {
            linksMap[edgeKey].trade_volume += d["Trade Volume"];
            linksMap[edgeKey].migration_flow += d["Migration Flow"];
        } else {
            linksMap[edgeKey] = {
                source: d["Source Country"],
                target: d["Trade Category"],
                trade_volume: d["Trade Volume"],
                migration_flow: d["Migration Flow"]
            };
        }
    });

    // Convert the aggregated links map into an array and round off values for D3
    const links = Object.values(linksMap).map(link => ({
        ...link,
        trade_volume: parseFloat(link.trade_volume.toFixed(2)),
        migration_flow: parseFloat(link.migration_flow.toFixed(2))
    }));

    const linkForce = d3.forceLink(links)
        .id(d => d.id)
        .distance(d => 50 + d.trade_volume * 5); // Weight link distance by aggregated trade volume

    const simulation = d3.forceSimulation(nodes)
        .force("link", linkForce)
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    function ticked() {
        // Draw links (edges) and add labels for rounded trade volume and migration flow
        const link = svg.selectAll(".link")
            .data(links)
            .join("line")
            .attr("class", "link")
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
            .attr("stroke-width", d => d.trade_volume / 10)
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6);

        // Edge labels for rounded values
        svg.selectAll(".link-label")
            .data(links)
            .join("text")
            .attr("class", "link-label")
            .attr("x", d => (d.source.x + d.target.x) / 2)
            .attr("y", d => (d.source.y + d.target.y) / 2)
            .attr("dy", -5)
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .style("fill", "#333")
            .text(d => `Trade: ${d.trade_volume}, Mig: ${d.migration_flow}`);

        // Draw nodes and add labels
        const node = svg.selectAll(".node")
            .data(nodes)
            .join("circle")
            .attr("class", "node")
            .attr("r", d => (d.type === "country" ? 8 : 6))
            .attr("fill", d => (d.type === "country" ? "#1f77b4" : "#ff7f0e"))
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // Node labels
        svg.selectAll(".node-label")
            .data(nodes)
            .join("text")
            .attr("class", "node-label")
            .attr("x", d => d.x)
            .attr("y", d => d.y - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "#333")
            .text(d => d.id);
    }

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}
