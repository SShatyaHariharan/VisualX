from app import db

class DataSource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # csv, postgresql, mysql, mongodb
    filepath = db.Column(db.String(500), nullable=True)
    connection_string = db.Column(db.String(500), nullable=True)