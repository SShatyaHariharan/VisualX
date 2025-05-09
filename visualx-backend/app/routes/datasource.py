import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app import db
from app.models.datasource import DataSource
from sqlalchemy import create_engine, text


bp = Blueprint('datasource', __name__)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# List all data sources
@bp.route('/datasources', methods=['GET'])
def list_datasources():
    sources = DataSource.query.all()
    output = []
    for src in sources:
        output.append({
            'id': src.id,
            'name': src.name,
            'type': src.type,
            'filepath': src.filepath,
            'connection_string': src.connection_string
        })
    return jsonify(output), 200

# Register a new datasource (CSV upload or MySQL)
@bp.route('/datasources', methods=['POST'])
def register_datasource():
    datasource_type = request.form.get('type')
    name = request.form.get('name')

    if datasource_type == 'csv':
        if 'file' not in request.files:
            return jsonify({'message': 'No file part in request'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'message': 'No file selected'}), 400

        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        source = DataSource(
            name=name or filename,
            type='csv',
            filepath=file_path,
            connection_string=None
        )

    elif datasource_type == 'mysql':
        connection_string = request.form.get('connection_string')
        if not connection_string:
            return jsonify({'message': 'MySQL connection string is required'}), 400

        # Try connecting to validate MySQL connection
        try:
            engine = create_engine(connection_string)
            with engine.connect() as conn:
                conn.execute(text("SELECT 1")) 
        except Exception as e:
            return jsonify({'message': f"MySQL connection failed: {str(e)}"}), 400

        source = DataSource(
            name=name or 'MySQL DataSource',
            type='mysql',
            filepath=None,
            connection_string=connection_string
        )

    else:
        return jsonify({'message': 'Invalid datasource type'}), 400

    db.session.add(source)
    db.session.commit()

    return jsonify({"id": source.id, "message": "Datasource registered successfully."}), 201

# Get a single data source
@bp.route('/datasources/<int:id>', methods=['GET'])
def get_datasource(id):
    src = DataSource.query.get_or_404(id)
    return jsonify({
        "id": src.id,
        "name": src.name,
        "type": src.type,
        "filepath": src.filepath,
        "connection_string": src.connection_string
    }), 200

# Delete a data source
@bp.route('/datasources/<int:id>', methods=['DELETE'])
def delete_datasource(id):
    src = DataSource.query.get_or_404(id)
    db.session.delete(src)
    db.session.commit()
    return jsonify({"message": "Data source deleted."}), 200