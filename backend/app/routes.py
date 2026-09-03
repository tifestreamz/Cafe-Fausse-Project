import random
import re
from datetime import datetime

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError

from .extensions import db
from .models import Customer, Reservation

api = Blueprint("api", __name__, url_prefix="/api")

TOTAL_TABLES = 30
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@api.post("/reservations")
def create_reservation():
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    phone = (data.get("phone") or "").strip() or None
    date = (data.get("date") or "").strip()
    hour = (data.get("hour") or "").strip()
    guests = data.get("guests")

    if not name or not email or not date or not hour:
        return jsonify({"error": "Please fill in your name, email, date, and time to book a table."}), 400

    if not EMAIL_RE.match(email):
        return jsonify({"error": "Please enter a valid email address."}), 400

    try:
        time_slot = datetime.strptime(f"{date} {hour}", "%Y-%m-%d %H:%M")
    except ValueError:
        return jsonify({"error": "Please choose a valid date and time."}), 400

    try:
        guests = int(guests)
    except (TypeError, ValueError):
        guests = 2

    booked_tables = {
        row.table_number
        for row in Reservation.query.filter_by(time_slot=time_slot).all()
    }
    available_tables = [t for t in range(1, TOTAL_TABLES + 1) if t not in booked_tables]

    if not available_tables:
        return jsonify({"error": "Sorry, that time slot is fully booked. Please choose another time."}), 409

    customer = Customer.query.filter_by(email=email).first()
    if customer is None:
        customer = Customer(name=name, email=email, phone=phone)
        db.session.add(customer)
    else:
        customer.name = name
        customer.phone = phone or customer.phone

    for _ in range(5):
        table_number = random.choice(available_tables)
        reservation = Reservation(
            customer=customer,
            time_slot=time_slot,
            guests=guests,
            table_number=table_number,
        )
        db.session.add(reservation)
        try:
            db.session.commit()
            return jsonify({
                "table_number": table_number,
                "time_slot": time_slot.isoformat(),
                "email": email,
            }), 201
        except IntegrityError:
            db.session.rollback()
            available_tables.remove(table_number)
            if not available_tables:
                return jsonify({"error": "Sorry, that time slot is fully booked. Please choose another time."}), 409

    return jsonify({"error": "Could not complete the reservation, please try again."}), 500


@api.post("/newsletter")
def subscribe_newsletter():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()

    if not email or not EMAIL_RE.match(email):
        return jsonify({"error": "Please enter a valid email address."}), 400

    customer = Customer.query.filter_by(email=email).first()
    if customer is None:
        customer = Customer(email=email, newsletter_signup=True)
        db.session.add(customer)
    else:
        customer.newsletter_signup = True
    db.session.commit()

    return jsonify({"email": email, "subscribed": True}), 201
