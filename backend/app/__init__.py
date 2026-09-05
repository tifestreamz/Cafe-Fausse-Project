import os

from flask import Flask
from flask_cors import CORS

from .extensions import db


def create_app():
    app = Flask(__name__)

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        database_url = f"sqlite:///{os.path.join(base_dir, 'cafe_fausse.db')}"
    elif database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    origins = [o.strip() for o in os.environ.get("FRONTEND_ORIGIN", "*").split(",")]
    CORS(app, resources={r"/api/*": {"origins": origins}})

    from . import models  # noqa: F401
    from .routes import api

    app.register_blueprint(api)

    with app.app_context():
        db.create_all()
        from .seeds import seed_initial_data
        seed_initial_data()

    return app
