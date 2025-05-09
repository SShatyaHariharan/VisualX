from flask import Blueprint, request, jsonify
import os
from openai import OpenAI

bp = Blueprint('insight', __name__)

# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY")) 
client = OpenAI(
    base_url="https://api.aimlapi.com/v1",
    api_key="b0d83755baf84755a606c17b1ae08d1e",    
)

@bp.route('/insights', methods=['POST'])
def generate_insights():
    payload = request.get_json()
    charts = payload.get("charts", [])

    if not charts or not isinstance(charts, list):
        return jsonify({"error": "Missing or invalid 'charts' in request"}), 400

    try:
        combined_prompt = "You are a data analyst. Based on the following chart data, generate a concise, insightful summary highlighting key trends, anomalies, and conclusions.\n\n"

        for i, chart in enumerate(charts, 1):
            sql = chart.get("sql_query")
            data = chart.get("data")
            title = chart.get("title", f"Chart {i}")

            if not sql or not data:
                return jsonify({"error": f"Missing SQL query or data for chart {i} ({title})"}), 400

            combined_prompt += f"---\nChart Title: {title}\nSQL Query: {sql}\nData: {data}\n"

        # Use OpenAI v1.x method
        response = client.chat.completions.create(
            model="chatgpt-4o-latest",
            messages=[{"role": "user", "content": combined_prompt}],
            max_tokens=800,
            temperature=0.5
        )

        insight_text = response.choices[0].message.content
        return jsonify({"insight": insight_text}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500