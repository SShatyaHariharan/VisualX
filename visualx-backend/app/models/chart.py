# from app import db

# class Chart(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String(255), nullable=False)
#     chart_type = db.Column(db.String(50), nullable=False)  # bar, line, pie, etc.
#     sql_query = db.Column(db.String)  # SQL query to fetch data
#     config_json = db.Column(db.Text, nullable=True)  # stores chart settings like colors, labels
#     dashboard_id = db.Column(db.Integer, nullable=True)  # Foreign key to Dashboard (optional)
#     datasource_id = db.Column(db.Integer, db.ForeignKey('data_source.id'))

from app import db

class Chart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    chart_type = db.Column(db.String(50), nullable=False)
    sql_query = db.Column(db.Text, nullable=True)
    config_json = db.Column(db.Text, default='{}')
    dashboard_id = db.Column(db.Integer, db.ForeignKey('dashboard.id'), nullable=False)
    datasource_id = db.Column(db.Integer, db.ForeignKey('data_source.id'), nullable=False)
    x_column = db.Column(db.String(100))
    y_column = db.Column(db.String(100))
    value_column = db.Column(db.String(100))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "chart_type": self.chart_type,
            "sql_query": self.sql_query,
            "config_json": self.config_json,
            "dashboard_id": self.dashboard_id,
            "datasource_id": self.datasource_id,
            "x_column": self.x_column,
            "y_column": self.y_column,
            "value_column": self.value_column
        }