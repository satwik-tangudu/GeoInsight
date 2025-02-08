import streamlit.components.v1 as components

def render_parallel_coordinates_chart(data_json):
    # Read the d3.min.js file from node_modules
    with open("node_modules/d3/dist/d3.min.js") as d3_file:
        d3_script = d3_file.read()

    with open("src/assets/chart6.js") as f:
        script = f.read()

    components.html(
        f"""
        <div id="chart"></div>
        <script>
            {d3_script}  <!-- Injected D3 code -->
        </script>
        <script>
            {script}
            drawParallelCoordinates(`{data_json}`);
        </script>
        """,
        height=500,
    )