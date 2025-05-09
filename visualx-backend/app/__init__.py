from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Register blueprints here
    from app.routes import auth, dashboard, datasource, upload, query, chart, insight
    app.register_blueprint(auth.bp, url_prefix='/api')
    app.register_blueprint(dashboard.bp, url_prefix='/api')
    app.register_blueprint(datasource.bp, url_prefix='/api')
    app.register_blueprint(upload.bp, url_prefix='/api')
    app.register_blueprint(query.bp, url_prefix='/api')
    app.register_blueprint(chart.bp, url_prefix='/api')
    app.register_blueprint(insight.bp, url_prefix='/api')

    return app