from app import db

class Dashboard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    layout_json = db.Column(db.Text, nullable=True)  # Stores dashboard layout (JSON)
    created_by = db.Column(db.String(255), nullable=False)  # User email or ID
    datasource_id = db.Column(db.Integer, nullable=True)  # Optional: linked data source