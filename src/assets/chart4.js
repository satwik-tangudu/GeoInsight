function drawPieChart(data) {
    const width = 800;
    const height = 450;
    const radius = Math.min(width, height) / 2;

    // Create SVG container
    const svg = d3.select('#pie-chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2+50) + ',' + height / 2 + ')');

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pieGenerator = d3.pie()
        .value(d => d.value);

    const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Create a tooltip div (invisible by default)
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background', '#f4f4f4')
        .style('border', '1px solid #d3d3d3')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('font-size', '12px')
        .style('opacity', 0);

    function update(data) {
        // Create an array of country and expenditure pairs from the data
        const formattedData = Object.entries(data[0])
            .filter(([key, value]) => key !== 'Time Period')  // Exclude 'Time Period'
            .map(([key, value]) => ({ Country: key, value: +value }));

        const totalExpenditure = formattedData.reduce((acc, d) => acc + d.value, 0); // Calculate total

        const arcs = pieGenerator(formattedData);

        // Data join for pie slices
        const path = svg.selectAll('path')
            .data(arcs, d => d.data.Country);  // Use country as the key

        // Enter: Add new slices
        path.enter().append('path')
            .attr('d', arcGenerator)
            .attr('fill', (d, i) => color(i))
            .each(function(d) { this._current = d; })  // Save current state for transition
            // Tooltip events
            .on('mouseover', function(event, d) {
                const percentage = ((d.data.value / totalExpenditure) * 100).toFixed(2);
                tooltip.transition().duration(200).style('opacity', 0.9);
                tooltip.html(`Country: ${d.data.Country}<br/>Expenditure: ${d.data.value}%<br/>Percentage: ${percentage}%`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mousemove', function(event) {
                // Move tooltip with the mouse
                tooltip.style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                // Hide tooltip
                tooltip.transition().duration(500).style('opacity', 0);
            });

        // Update: Transition existing slices
        path.transition().duration(750).attrTween('d', arcTween);

        // Exit: Remove old slices
        path.exit().remove();

        // Data join for text labels (country and percentage)
        const textLabels = svg.selectAll('text.slice-label')
            .data(arcs, d => d.data.Country);  // Use country as the key

        // Enter new text labels
        textLabels.enter()
            .append('text')
            .attr('class', 'slice-label')
            .attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
            .attr('dy', '0.35em')
            .style('text-anchor', 'middle')
            .text(d => {
                const percentage = ((d.data.value / totalExpenditure) * 100).toFixed(2); // Calculate percentage
                return `${percentage}%`;  // Display only the percentage inside the slice
            });

        // Update: Transition existing text labels
        textLabels.transition().duration(750)
            .attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
            .text(d => {
                const percentage = ((d.data.value / totalExpenditure) * 100).toFixed(2);
                return `${percentage}%`;
            });

        // Exit: Remove old text labels
        textLabels.exit().remove();

        // Data join for legend
        const legend = svg.selectAll('.legend')
            .data(formattedData, d => d.Country);  // Use country as the key

        // Enter new legend items
        const legendEnter = legend.enter().append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(-400, ${-200 + i * 20})`);

        legendEnter.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', (d, i) => color(i));

        legendEnter.append('text')
            .attr('x', 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style("text-anchor", "start")
            .text(d => d.Country);

        // Remove old legend items
        legend.exit().remove();
    }

    function arcTween(a) {
        const i = d3.interpolate(this._current, a);
        this._current = i(0);
        return t => arcGenerator(i(t));
    }

    update(data);
}

