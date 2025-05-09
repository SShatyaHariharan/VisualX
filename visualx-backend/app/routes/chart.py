from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.chart import Chart

bp = Blueprint('chart', __name__)

# List all charts
@bp.route('/charts', methods=['GET'])
@jwt_required()
def list_charts():
    charts = Chart.query.all()
    output = []
    for c in charts:
        output.append({
            "id": c.id,
            "title": c.title,
            "chart_type": c.chart_type,
            "sql_query": c.sql_query,
            "config_json": c.config_json,
            "dashboard_id": c.dashboard_id,
            "datasource_id": c.datasource_id,
            "x_column": c.x_column,
            "y_column": c.y_column,
            "value_column": c.value_column
        })
    return jsonify(output), 200

# Create a new chart
@bp.route('/charts', methods=['POST'])
@jwt_required()
def create_chart():
    data = request.get_json()

    required_fields = ['title', 'chart_type', 'sql_query', 'dashboard_id', 'datasource_id']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    new_chart = Chart(
        title=data['title'],
        chart_type=data['chart_type'],
        sql_query=data['sql_query'],
        config_json=data.get('config_json', '{}'),
        dashboard_id=data['dashboard_id'],
        datasource_id=data['datasource_id'],
        x_column=data.get('x_column'),
        y_column=data.get('y_column'),
        value_column=data.get('value_column')
    )

    db.session.add(new_chart)
    db.session.commit()

    return jsonify({"id": new_chart.id, "message": "Chart created."}), 201

# Get charts for a specific dashboard
@bp.route('/charts/by-dashboard', methods=['POST'])
@jwt_required()
def get_charts_for_dashboard():
    data = request.get_json()
    dashboard_id = data.get("dashboard_id")
    if not dashboard_id:
        return jsonify({"msg": "dashboard_id is required"}), 400

    charts = Chart.query.filter_by(dashboard_id=dashboard_id).all()

    return jsonify([
        {
            "id": c.id,
            "title": c.title,
            "chart_type": c.chart_type,
            "sql_query": c.sql_query,
            "config_json": c.config_json,
            "dashboard_id": c.dashboard_id,
            "datasource_id": c.datasource_id,
            "x_column": c.x_column,
            "y_column": c.y_column,
            "value_column": c.value_column
        } for c in charts
    ]), 200

# Update a chart
@bp.route('/charts/<int:id>', methods=['PUT'])
@jwt_required()
def update_chart(id):
    chart = Chart.query.get_or_404(id)
    data = request.get_json()
    chart.title = data.get('title', chart.title)
    chart.chart_type = data.get('chart_type', chart.chart_type)
    chart.sql_query = data.get('sql_query', chart.sql_query)
    chart.config_json = data.get('config_json', chart.config_json)
    chart.datasource_id = data.get('datasource_id', chart.datasource_id)
    chart.x_column = data.get('x_column', chart.x_column)
    chart.y_column = data.get('y_column', chart.y_column)
    chart.value_column = data.get('value_column', chart.value_column)
    db.session.commit()
    return jsonify({"message": "Chart updated."}), 200

# Delete a chart
@bp.route('/charts/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_chart(id):
    chart = Chart.query.get_or_404(id)
    db.session.delete(chart)
    db.session.commit()
    return jsonify({"message": "Chart deleted."}), 200