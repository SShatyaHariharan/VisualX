from app.models.user import User
from app.models.dashboard import Dashboard
from app.models.chart import Chart
from app.models.datasource import DataSource

app = create_app()

with app.app_context():
    db.create_all()
    
    # Optional: Create a default admin user
    if not User.query.filter_by(email='admin@visualx.io').first():
        admin = User(
            username="admin",
            email="admin@visualx.io",
            password="admin123"  # ⚠️ Hash password properly in production!
        )
        db.session.add(admin)
        db.session.commit()

    print("✅ Tables created and admin user added.")