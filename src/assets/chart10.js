function drawDotMap(data) {
    const parsedData = JSON.parse(data);

    // Set dimensions and margins
    const width = 1200;
    const height = 600;

    // Create an SVG element or clear existing one
    d3.select("#dot-map").selectAll("*").remove();

    const svg = d3.select("#dot-map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Projection and path generator for the map
    const projection = d3.geoMercator()
        .scale(130)
        .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    // Tooltip setup
    const tooltip = d3.select("#dot-map").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "#333")
        .style("color", "#fff")
        .style("padding", "10px")
        .style("border-radius", "8px");

    // Create a map of country names to cost export values
    const costByCountry = {
        'Brazil': +parsedData[0].Brazil,
        'China': +parsedData[0].China,
        'India': +parsedData[0].India,
        'Russia': +parsedData[0].Russia,
        'Saudi Arabia': +parsedData[0]['Saudi Arabia']
    };

    // Load GeoJSON data (world countries)
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then(function(geoData) {

        const countryNameMap = {
            "Brazil": "Brazil",
            "China": "China",
            "India": "India",
            "Russia": "Russia",
            "Saudi Arabia": "Saudi Arabia"
        };

        // Draw countries on the map with light grey fill
        svg.selectAll("path")
            .data(geoData.features)
            .join("path")
            .attr("d", path)
            .attr("fill", "#eee")  // Light grey background for countries
            .attr("stroke", "#000");  // Black borders for countries

        // Add dots on countries based on cost values (one dot per 2 dollars)
        svg.selectAll(".country-dots")
            .data(geoData.features.filter(d => costByCountry[d.properties.name]))
            .join(function(enter) {
                const group = enter.append('g').attr('class', 'country-dots');
                return group;
            })
            .each(function(d) {
                const countryName = d.properties.name;
                const costValue = costByCountry[countryName];
                const numDots = Math.floor(costValue / 2);  // One dot per 2 dollars

                const bounds = path.bounds(d);  // Get bounding box of the country
                const xMin = bounds[0][0], xMax = bounds[1][0];
                const yMin = bounds[0][1], yMax = bounds[1][1];

                let dotsPlaced = 0;
                while (dotsPlaced < numDots) {
                    const randomX = Math.random() * (xMax - xMin) + xMin;
                    const randomY = Math.random() * (yMax - yMin) + yMin;

                    if (d3.geoContains(d, projection.invert([randomX, randomY]))) {
                        d3.select(this).append('circle')
                            .attr('cx', randomX)
                            .attr('cy', randomY)
                            .attr('r', 2)  // Adjust radius size based on your preference
                            .attr('fill', '#23415a')  // Blue color for dots (#4682b4 is SteelBlue)
                            .attr('opacity', 0.8);
                        dotsPlaced++;
                    }
                }
            })
            .on("mouseover", function(event, d) {
                const countryName = d.properties.name;
                const Value = costByCountry[countryName] || "No data";

                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html(`<strong>${countryName}</strong><br>Cost Export Value: ${Value.toLocaleString()}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 50) + "px");
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                       .style("top", (event.pageY - 50) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition().duration(200).style("opacity", 0);
            });
    });
}