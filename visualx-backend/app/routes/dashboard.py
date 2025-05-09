from flask import Blueprint, request, jsonify
from app.models.dashboard import Dashboard
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('dashboard', __name__)

# List all dashboards
@bp.route('/dashboards', methods=['GET'])
@jwt_required()
def list_dashboards():
    dashboards = Dashboard.query.all()
    output = []
    for dash in dashboards:
        output.append({
            'id': dash.id,
            'title': dash.title,
            'created_by': dash.created_by,
            'datasource_id': dash.datasource_id
        })
    return jsonify(output), 200

# Create a new dashboard
@bp.route('/dashboards', methods=['POST'])
@jwt_required()
def create_dashboard():
    data = request.get_json()
    current_user = get_jwt_identity()  # returns email as string
    new_dash = Dashboard(
        title=data['title'],
        layout_json=data.get('layout_json', '{}'),
        created_by=current_user,
        datasource_id=data.get('datasource_id')
    )
    db.session.add(new_dash)
    db.session.commit()
    return jsonify({"id": new_dash.id, "message": "Dashboard created."}), 201

# Get a single dashboard
@bp.route('/dashboards/<int:id>', methods=['GET'])
@jwt_required()
def get_dashboard(id):
    dash = Dashboard.query.get_or_404(id)
    return jsonify({
        'id': dash.id,
        'title': dash.title,
        'layout_json': dash.layout_json,
        'created_by': dash.created_by,
        'datasource_id': dash.datasource_id
    }), 200

# Update a dashboard
@bp.route('/dashboards/<int:id>', methods=['PUT'])
@jwt_required()
def update_dashboard(id):
    dash = Dashboard.query.get_or_404(id)
    data = request.get_json()
    dash.title = data.get('title', dash.title)
    dash.layout_json = data.get('layout_json', dash.layout_json)
    db.session.commit()
    return jsonify({"message": "Dashboard updated."}), 200

# Delete a dashboard
@bp.route('/dashboards/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_dashboard(id):
    dash = Dashboard.query.get_or_404(id)
    db.session.delete(dash)
    db.session.commit()
    return jsonify({"message": "Dashboard deleted."}), 200