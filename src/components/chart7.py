# import streamlit.components.v1 as components
# import json

# def render_difference_chart(data_json):
#     # Convert data_json to a JSON string if it isn’t already
#     data_json_str = json.dumps(data_json)

#     # Read the d3.min.js file from node_modules
#     with open("node_modules/d3/dist/d3.min.js") as d3_file:
#         d3_script = d3_file.read()

#     # Read your custom chart JS
#     with open("src/assets/chart7.js") as chart_file:
#         script = chart_file.read()

#     # Inject both d3.min.js and your custom chart.js into the HTML
#     components.html(
#         f"""
#         <div id="chart"></div>
#         <script>
#             {d3_script}  <!-- Injected D3 code -->
#         </script>
#         <script>
#             {script}     <!-- Injected custom chart JS -->
#             drawDifferenceChart({data_json_str});  <!-- Pass data as JSON string -->
#         </script>
#         """,
#         height=500,
#     )

import streamlit.components.v1 as components

def render_chart(data_json):
    with open("node_modules/d3/dist/d3.min.js") as d3_file:
        d3_script = d3_file.read()
    
    with open("src/assets/chart7.js") as f:
        script = f.read()

    components.html(
        f"""
        <div id="chart"></div>
        <div id="tooltip" style="position: absolute; visibility: hidden; background-color: white; border: 1px solid #ccc; padding: 5px;"></div>
        <script>
            {d3_script}
        </script>
        <script>
            {script}
            drawDifferenceChart(`{data_json}`);
        </script>
        """,
        height=500,
    )
