import streamlit.components.v1 as components

def render_chart(data_json):
    # Inject D3 library and chart script
    with open("node_modules/d3/dist/d3.min.js") as d3_file:
        d3_script = d3_file.read()
    
    with open("src/assets/chart13.js") as f:
        script = f.read()
    
    components.html(
        f"""
        <div id="circle_packing" style="width:100%; display: flex;
  justify-content: center;
  align-items: center;"
></div>
        <script>
            {d3_script}
        </script>
        <script>
            {script}
            createZoomableCirclePacking({data_json});
        </script>
        """,
        height=950,
    )
