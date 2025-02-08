// function createZoomableCirclePacking(data) {
//     const width = 928;
//     const height = width;

//     // Create color scale
//     const color = d3.scaleLinear()
//         .domain([0, 5])
//         .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
//         .interpolate(d3.interpolateHcl);

//     // Define pack layout
//     const pack = data => d3.pack()
//         .size([width, height])
//         .padding(3)(
//             d3.hierarchy(data)
//             .sum(d => d.value)
//             .sort((a, b) => b.value - a.value)
//         );

//     const root = pack(data);

//     // Create SVG container
//     const svg = d3.select("#circle_packing").append("svg")
//         .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
//         .attr("width", width)
//         .attr("height", height)
//         .style("max-width", "100%")
//         .style("height", "auto")
//         .style("display", "block")
//         .style("background", color(0))
//         .style("cursor", "pointer");

//     let focus = root;
//     let view;
//     let zoomActive = false;  // Flag to prevent multiple zooms at once

//     // Append circles (nodes)
//     const node = svg.append("g")
//         .selectAll("circle")
//         .data(root.descendants().slice(1))
//         .join("circle")
//         .attr("fill", d => d.children ? color(d.depth) : "white")
//         .attr("pointer-events", d => !d.children ? "none" : null)
//         .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
//         .on("mouseout", function() { d3.select(this).attr("stroke", null); })
//         .on("click", (event, d) => {
//             if (!zoomActive && focus !== d) {
//                 zoom(event, d);
//                 event.stopPropagation();
//             }
//         });

//     // Append text labels (name and value)
//     const label = svg.append("g")
//         .style("font", "12px sans-serif")
//         .attr("pointer-events", "none")
//         .attr("text-anchor", "middle")
//         .selectAll("text")
//         .data(root.descendants())
//         .join("text")
//         .style("fill-opacity", d => d.parent === root ? 1 : 0)
//         .style("display", d => d.parent === root ? "inline" : "none")
//         .text(d => `${d.data.name} (${d.value.toFixed(2)}B)`);

//     // Initial zoom setup
//     svg.on("click", () => {
//         if (!zoomActive) {
//             zoom(null, root);
//         }
//     });
    
//     zoomTo([root.x, root.y, root.r * 2]);

//     function zoomTo(v) {
//         const k = width / v[2];
        
//         view = v;
        
//         label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        
//         node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        
//         node.attr("r", d => d.r * k);
//     }

//     function zoom(event, d) {
//         focus = d;
        
//         // Set zoomActive to true to prevent additional clicks during transition
//         zoomActive = true;

//         const transition = svg.transition()
//             .duration(event ? 750 : 0)
//             .tween("zoom", () => {
//                 const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
//                 return t => zoomTo(i(t));
//             });

//        label.filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
//            .transition(transition)
//            .style("fill-opacity", d => d.parent === focus ? 1 : 0)
//            .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
//            .on("end", function(d) { 
//                if (d.parent !== focus) this.style.display = "none";
//                // Reset zoomActive to false after transition completes
//                zoomActive = false;
//            });
//     }
// }

function createZoomableCirclePacking(data) {
    const width = 928;
    const height = width;

    // Create color scale
    const color = d3.scaleLinear()
        .domain([0, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);

    // Define pack layout
    const pack = data => d3.pack()
        .size([width, height])
        .padding(3)(
            d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value)
        );

    const root = pack(data);

    // Create SVG container
    const svg = d3.select("#circle_packing").append("svg")
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .attr("width", width)
        .attr("height", height)
        .style("max-width", "100%")
        .style("height", "auto")
        .style("display", "block")
        .style("background", color(0))
        .style("cursor", "pointer")
        .on("click", () => zoom(null, root));  // Reset zoom on background click

    let focus = root;
    let view;

    // Append circles (nodes)
    const node = svg.append("g")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .join("circle")
        .attr("fill", d => d.children ? color(d.depth) : "white")
        .attr("pointer-events", d => !d.children ? "none" : null)
        .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
        .on("mouseout", function() { d3.select(this).attr("stroke", null); })
        .on("click", (event, d) => {
            if (focus !== d) {
                zoom(event, d);
                event.stopPropagation();
            }
        });

    // Append text labels (name and value)
    const label = svg.append("g")
        .style("font", "12px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .text(d => `${d.data.name} (${d.value.toFixed(2)}B)`);

    // Initial zoom setup
    zoomTo([root.x, root.y, root.r * 2]);

    function zoomTo(v) {
        const k = width / v[2];
        view = v;
        
        label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("r", d => d.r * k);
    }

    function zoom(event, d) {
        focus = d;

        const transition = svg.transition()
            .duration(event && event.altKey ? 7500 : 750) // Slow zoom if Alt is held
            .tween("zoom", () => {
                const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                return t => zoomTo(i(t));
            });

        label.filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
           .transition(transition)
           .style("fill-opacity", d => d.parent === focus ? 1 : 0)
           .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
           .on("end", function(d) { 
               if (d.parent !== focus) this.style.display = "none";
           });
    }
}

