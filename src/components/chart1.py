import streamlit.components.v1 as components

def render_chart(data_json):
    # Read the d3.min.js file from node_modules
    with open("node_modules/d3/dist/d3.min.js") as d3_file:
        d3_script = d3_file.read()

    with open("src/assets/chart1.js") as f:
        script = f.read()

    components.html(
        f"""
        <div id="chart"></div>
        <div id="tooltip" style="position: absolute; visibility: hidden; background-color: white; border: 1px solid #ccc; padding: 5px;"></div>
        <script>
            {d3_script}  <!-- Injected D3 code -->
        </script>
        <script>
            {script}
            drawLineChart(`{data_json}`);
        </script>
        """,
        height=400,
    )