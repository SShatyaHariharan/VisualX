import os
import pandas as pd
import sqlite3
from flask import Blueprint, request, jsonify
from sqlalchemy import create_engine, text
from app.models.datasource import DataSource
from app import db

bp = Blueprint('query', __name__)

@bp.route('/query', methods=['POST'])
def run_query():
    data = request.get_json()

    datasource_id = data.get('datasource_id')
    sql_query = data.get('query')

    if not datasource_id or not sql_query:
        return jsonify({"error": "Missing datasource_id or query"}), 400

    datasource = DataSource.query.get(datasource_id)
    if not datasource:
        return jsonify({"error": "Data source not found"}), 404

    try:
        if datasource.type == 'csv':
            if not datasource.filepath or not os.path.exists(datasource.filepath):
                return jsonify({"error": "CSV file not found"}), 404

            df = pd.read_csv(datasource.filepath)

            conn = sqlite3.connect(':memory:')
            df.to_sql('dataset', conn, index=False, if_exists='replace')
            cur = conn.cursor()
            cur.execute(sql_query)
            rows = cur.fetchall()
            columns = [description[0] for description in cur.description]
            conn.close()

        elif datasource.type == 'mysql':
            if not datasource.connection_string:
                return jsonify({"error": "Missing MySQL connection string"}), 400

            try:
                engine = create_engine(datasource.connection_string)
                with engine.connect() as connection:
                    result = connection.execute(text(sql_query))
                    columns = result.keys()
                    rows = result.fetchall()
            except Exception as e:
                return jsonify({"error": f"MySQL connection failed: {str(e)}"}), 500

        else:
            return jsonify({"error": "Unsupported data source type"}), 400

        data_out = [dict(zip(columns, row)) for row in rows]
        return jsonify(data_out), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500