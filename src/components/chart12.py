# chart.py
import streamlit.components.v1 as components

def render_chart(data_json):
    # Read the d3.min.js file from node_modules
    with open("node_modules/d3/dist/d3.min.js") as d3_file:
        d3_script = d3_file.read()

    with open("src/assets/chart12.js") as f:
        script = f.read()

    components.html(
        f"""
        <div id="chart" style="width:100%; display: flex;
  justify-content: center;
  align-items: center;"></div>
        <script>
            {d3_script}  <!-- Injected D3 code -->
        </script>
        <script>
            {script}
            drawForceDirectedGraph(`{data_json}`);
        </script>
        """,
        height=600,
    )
