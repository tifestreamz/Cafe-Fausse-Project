import os

from flask import Flask
from flask_cors import CORS

from .extensions import db


def create_app():
    app = Flask(__name__)

    database_url = os.environ.get(
        "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/cafe_fausse"
    )
    # Some providers (older Heroku-style URLs) hand out "postgres://", which
    # SQLAlchemy's psycopg2 dialect no longer accepts.
    if database_url.startswith("postgres://"):
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

    return app
