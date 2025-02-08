function drawProportionalSymbolMap(data) {
    const parsedData = JSON.parse(data);

    // Set dimensions and margins
    const width = 1200;
    const height = 600;
    
    // Create an SVG element or clear existing one
    d3.select("#proportional-symbol-map").selectAll("*").remove();
    
    const svg = d3.select("#proportional-symbol-map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Projection and path generator for the map
    const projection = d3.geoMercator()
        .scale(130)
        .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    // Tooltip setup
    const tooltip = d3.select("#proportional-symbol-map").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "#333")
        .style("color", "#fff")
        .style("padding", "10px")
        .style("border-radius", "8px");

    // Scale for circle radius based on enrollment numbers
    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(parsedData, d => Math.max(...Object.values(d).slice(1)))])
        .range([0, 25]); // Adjust range for circle sizes

    // Load GeoJSON data (world countries)
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then(function(geoData) {
        
        const enrollmentByCountry = {
            'Brazil': +parsedData[0].Brazil,
            'China': +parsedData[0].China,
            'India': +parsedData[0].India,
            'Russia': +parsedData[0].Russia,
            'Saudi Arabia': +parsedData[0]['Saudi Arabia']
        };

        const countryCoordinates = {
            'Brazil': [-51.92528, -14.235004],  // Longitude, Latitude of Brazil
            'China': [104.195397, 35.86166],   // Longitude, Latitude of China
            'India': [78.96288, 20.593684],     // Longitude, Latitude of India
            'Russia': [105.318756, 61.52401],   // Longitude, Latitude of Russia
            'Saudi Arabia': [45.079162, 23.885942] // Longitude, Latitude of Saudi Arabia
            // Add more countries if needed.
        };

        svg.selectAll("path")
            .data(geoData.features)
            .join("path")
            .attr("d", path)
            .attr("fill", "#eee") // Default color for countries
            .attr("stroke", "#333");

        // Draw circles proportional to enrollment numbers on top of countries
        svg.selectAll("circle")
            .data(Object.keys(enrollmentByCountry))
            .join("circle")
            .attr("cx", d => projection(countryCoordinates[d])[0])
            .attr("cy", d => projection(countryCoordinates[d])[1])
            .attr("r", d => radiusScale(enrollmentByCountry[d]))
            .attr("fill", "rgba(69, 123, 157, 0.7)") // Color with some transparency
            .attr("stroke", "#333")
            .on("mouseover", function(event, d) {
                const enrollment = enrollmentByCountry[d] || "No data";

                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html(`<strong>${d}</strong><br>Enrollment: ${enrollment.toLocaleString()}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 50) + "px");

                d3.select(this).transition().duration(200).attr("stroke-width", "2px").attr("stroke", "#000");
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 50) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition().duration(200).style("opacity", 0);
                d3.select(this).transition().duration(200).attr("stroke-width", "1px");
            });

         // Add legend for circle sizes (optional)
         const legendGroup = svg.append('g')
           .attr('transform', `translate(${width - 100}, ${height / 2})`);

         legendGroup.append('text')
           .attr('x', -40)
           .attr('y', -20)
           .text('Enrollment')
           .style('font-size', '14px');

         const legendSizes = [1000000, 10000000, 50000000]; // Adjust based on your data range
        
         legendSizes.forEach((d, i) => {

           legendGroup.append('circle')
              .attr('cx', -40)
              .attr('cy', i * 40)
              .attr('r', radiusScale(d))
              .style('fill', "rgba(69,123,157,0.7)")
              .style('stroke', "#333");

           legendGroup.append('text')
              .attr('x', -15)
              .attr('y', i * 40 + radiusScale(d))
              .text(d.toLocaleString())
              .style('font-size', '12px');
       });
        
    });
}