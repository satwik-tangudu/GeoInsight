import streamlit.components.v1 as components

def render_chart(data_json):
    # Load D3.js and chord diagram JavaScript
    with open("node_modules/d3/dist/d3.min.js") as d3_file:
        d3_script = d3_file.read()

    with open("src/assets/chart11.js") as f:
        script = f.read()

    # Embed HTML and JavaScript to render the chord diagram
    components.html(
        f"""
        <div id="chord_diagram"></div>
        <script>
            {d3_script}
        </script>
        <script>
            {script}
            renderChordDiagram(`{data_json}`);
        </script>
        """,
        height=600,
    )
