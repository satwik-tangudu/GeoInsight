# import streamlit.components.v1 as components

# def render_sunburst_chart(data_json):
#     # Read the D3.js library from node_modules
#     with open("node_modules/d3/dist/d3.min.js") as d3_file:
#         d3_script = d3_file.read()

#     # Read your custom Sunburst chart JS
#     with open("src/assets/chart2.js") as chart_file:
#         script = chart_file.read()

#     # Inject both D3.js and your custom Sunburst chart JS into the HTML
#     components.html(
#         f"""
#         <div id="sunburst-chart"></div>
#         <script>
#             {d3_script} <!-- Injected D3 code -->
#         </script>
#         <script>
#             {script} <!-- Injected custom chart JS -->
#             drawSunburstChart({data_json}); <!-- Call your Sunburst chart function -->
#         </script>
#         """,
#         height=600,
#     )

import streamlit.components.v1 as components

def render_chart(data_json):
    # Read the d3.min.js file from node_modules
    with open("node_modules/d3/dist/d3.min.js") as d3_file:
        d3_script = d3_file.read()

    with open("src/assets/chart2.js") as f:
        script = f.read()

    components.html(
        f"""
        <div id="chart"></div>
        <script>
            {d3_script}  <!-- Injected D3 code -->
        </script>
        <script>
            {script}
            drawSunburstChart(`{data_json}`);
        </script>
        """,
        height=700,
    )
