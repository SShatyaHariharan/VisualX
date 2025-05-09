import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app import db
from app.models.datasource import DataSource

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}

bp = Blueprint('upload', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        file.save(save_path)

        # Optional: register as data source
        new_source = DataSource(name=filename, type='csv', filepath=save_path)
        db.session.add(new_source)
        db.session.commit()

        return jsonify({"message": "File uploaded successfully", "filepath": save_path}), 201

    return jsonify({"error": "Invalid file type"}), 400