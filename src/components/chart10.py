import streamlit.components.v1 as components

def render_chart(data_json):
    # Read the d3.min.js file from node_modules
    with open("node_modules/d3/dist/d3.min.js") as d3_file:
        d3_script = d3_file.read()

    # Read the custom dot map script (adjust path as necessary)
    with open("src/assets/chart10.js") as f:
        script = f.read()

    # Inject D3.js and custom script into Streamlit component
    components.html(
        f"""
        <div id="dot-map" style="width:100%; height:600px;"></div>
        <script>{d3_script}</script>
        <script>
            {script}
            drawDotMap(`{data_json}`);
        </script>
        """,
        height=600,
    )