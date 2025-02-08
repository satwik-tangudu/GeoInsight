function renderChordDiagram(data) {
    const parsedData = JSON.parse(data);
    const { names, matrix } = parsedData;

    const width = 700;
    const height = 600;
    const outerRadius = Math.min(width, height) * 0.5 - 100;
    const innerRadius = outerRadius - 20;

    const color = d3.scaleOrdinal(names, d3.schemeCategory10);

    const svg = d3.select("#chord_diagram")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "width: 100%; height: auto; font: 10px sans-serif; margin-top: -50px;");
    
    const chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending);

    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    const ribbon = d3.ribbon()
        .radius(innerRadius);

    const chords = chord(matrix);

    // Draw outer arcs for each group
    const group = svg.append("g")
        .selectAll("g")
        .data(chords.groups)
        .join("g");

    group.append("path")
        .style("fill", d => color(names[d.index]))
        .style("stroke", d => d3.rgb(color(names[d.index])).darker())
        .attr("d", arc)
        .append("title")
        .text(d => `${names[d.index]} Total: ${d.value}`);

    group.append("text")
        .attr("dy", ".35em")
        .attr("transform", d => `
            rotate(${(d.startAngle + d.endAngle) / 2 * 180 / Math.PI - 90})
            translate(${outerRadius + 5})
            ${((d.startAngle + d.endAngle) / 2 > Math.PI) ? "rotate(180)" : ""}
        `)
        .style("font-weight", "bold") // Make country names bold

        .attr("text-anchor", d => ((d.startAngle + d.endAngle) / 2 > Math.PI) ? "end" : "start")
        .text(d => names[d.index]);

    // Draw ribbons with hover effect for highlighting
    svg.append("g")
        .attr("fill-opacity", 0.7)
        .selectAll("path")
        .data(chords)
        .join("path")
        .attr("d", ribbon)
        .style("fill", d => color(names[d.source.index]))
        .style("stroke", d => d3.rgb(color(names[d.source.index])).darker())
        .on("mouseover", function(event, d) {
            d3.selectAll("path").style("opacity", 0.1);
            d3.select(this).style("opacity", 1);
        })
        .on("mouseout", function() {
            d3.selectAll("path").style("opacity", 0.7);
        })
        .append("title")
        .text(d => `${names[d.source.index]} → ${names[d.target.index]}: ${d.source.value}\n${names[d.target.index]} → ${names[d.source.index]}: ${d.target.value}`);
}
