import os
import random
import re
from datetime import datetime

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError

from .extensions import db
from .models import Customer, Reservation, Subscriber

api = Blueprint("api", __name__, url_prefix="/api")

TOTAL_TABLES = 30
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
SERVICE_SLOTS = [
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
]


def get_available_alternative_slots(date_obj, current_slot=None):
    start_of_day = datetime.combine(date_obj, datetime.min.time())
    end_of_day = datetime.combine(date_obj, datetime.max.time())
    reservations = Reservation.query.filter(
        Reservation.time_slot >= start_of_day,
        Reservation.time_slot <= end_of_day,
    ).all()
    booked_by_slot = {}
    for r in reservations:
        slot_str = r.time_slot.strftime("%H:%M")
        booked_by_slot.setdefault(slot_str, set()).add(r.table_number)

    alternatives = []
    for slot in SERVICE_SLOTS:
        if current_slot and slot == current_slot:
            continue
        booked_count = len(booked_by_slot.get(slot, set()))
        if booked_count < TOTAL_TABLES:
            alternatives.append({
                "time": slot,
                "tables_remaining": TOTAL_TABLES - booked_count,
            })
    return alternatives


@api.get("/availability")
def get_availability():
    date_str = (request.args.get("date") or "").strip()
    if not date_str:
        return jsonify({"error": "date query parameter is required (YYYY-MM-DD)."}), 400
    try:
        query_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Please use YYYY-MM-DD."}), 400

    start_of_day = datetime.combine(query_date, datetime.min.time())
    end_of_day = datetime.combine(query_date, datetime.max.time())
    reservations = Reservation.query.filter(
        Reservation.time_slot >= start_of_day,
        Reservation.time_slot <= end_of_day,
    ).all()

    booked_by_slot = {}
    for r in reservations:
        slot_str = r.time_slot.strftime("%H:%M")
        booked_by_slot.setdefault(slot_str, set()).add(r.table_number)

    slots_data = []
    for slot in SERVICE_SLOTS:
        booked_count = len(booked_by_slot.get(slot, set()))
        tables_remaining = max(0, TOTAL_TABLES - booked_count)
        slots_data.append({
            "time": slot,
            "available": tables_remaining > 0,
            "tables_remaining": tables_remaining,
            "tables_booked": booked_count,
            "total_tables": TOTAL_TABLES,
        })

    return jsonify({
        "date": date_str,
        "total_tables": TOTAL_TABLES,
        "slots": slots_data,
    })


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
        alternatives = get_available_alternative_slots(time_slot.date(), current_slot=hour)
        return jsonify({
            "error": "Sorry, that time slot is fully booked. Please choose an alternative available time.",
            "alternatives": alternatives,
        }), 409

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
            return jsonify(reservation.to_dict()), 201
        except IntegrityError:
            db.session.rollback()
            available_tables.remove(table_number)
            if not available_tables:
                alternatives = get_available_alternative_slots(time_slot.date(), current_slot=hour)
                return jsonify({
                    "error": "Sorry, that time slot is fully booked. Please choose an alternative available time.",
                    "alternatives": alternatives,
                }), 409

    return jsonify({"error": "Could not complete the reservation, please try again."}), 500


@api.post("/newsletter")
def subscribe_newsletter():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()

    if not email or not EMAIL_RE.match(email):
        return jsonify({"error": "Please enter a valid email address."}), 400

    subscriber = Subscriber.query.filter_by(email=email).first()
    if subscriber is None:
        subscriber = Subscriber(email=email)
        db.session.add(subscriber)
        db.session.commit()

    return jsonify({"email": email, "subscribed": True}), 201


ADMIN_PASSCODE = os.environ.get("ADMIN_PASSCODE", "fausse2026")


@api.post("/admin/login")
def admin_login():
    data = request.get_json(silent=True) or {}
    passcode = (data.get("passcode") or "").strip()
    if passcode == ADMIN_PASSCODE:
        return jsonify({
            "authenticated": True,
            "token": f"token_{ADMIN_PASSCODE}",
            "role": "Manager",
        })
    return jsonify({"error": "Invalid administrative passcode."}), 401


@api.get("/admin/tables")
def admin_get_tables():
    date_str = (request.args.get("date") or "").strip()
    hour_str = (request.args.get("hour") or "").strip()

    if not date_str or not hour_str:
        return jsonify({"error": "Both date (YYYY-MM-DD) and hour (HH:MM) are required."}), 400

    try:
        time_slot = datetime.strptime(f"{date_str} {hour_str}", "%Y-%m-%d %H:%M")
    except ValueError:
        return jsonify({"error": "Invalid date or time format."}), 400

    reservations = Reservation.query.filter_by(time_slot=time_slot).all()
    occupied_map = {r.table_number: r.to_dict() for r in reservations}

    tables_data = []
    for table_num in range(1, TOTAL_TABLES + 1):
        is_occupied = table_num in occupied_map
        tables_data.append({
            "table_number": table_num,
            "is_occupied": is_occupied,
            "reservation": occupied_map.get(table_num),
        })

    return jsonify({
        "date": date_str,
        "hour": hour_str,
        "total_tables": TOTAL_TABLES,
        "occupied_count": len(occupied_map),
        "available_count": TOTAL_TABLES - len(occupied_map),
        "occupancy_rate": round((len(occupied_map) / TOTAL_TABLES) * 100, 1),
        "tables": tables_data,
    })


@api.get("/admin/reservations")
def admin_get_reservations():
    date_str = (request.args.get("date") or "").strip()
    query = Reservation.query

    if date_str:
        try:
            query_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            start = datetime.combine(query_date, datetime.min.time())
            end = datetime.combine(query_date, datetime.max.time())
            query = query.filter(Reservation.time_slot >= start, Reservation.time_slot <= end)
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    reservations = query.order_by(Reservation.time_slot.asc()).all()
    return jsonify({
        "count": len(reservations),
        "reservations": [r.to_dict() for r in reservations],
    })


@api.delete("/admin/reservations/<int:reservation_id>")
def admin_cancel_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({"error": "Reservation not found."}), 404

    table_num = reservation.table_number
    time_str = reservation.time_slot.strftime("%Y-%m-%d %H:%M")
    db.session.delete(reservation)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": f"Reservation cancelled. Table #{table_num} for {time_str} is now freed.",
    })


@api.get("/admin/customers")
def admin_get_customers():
    customers = Customer.query.order_by(Customer.created_at.desc()).all()
    return jsonify({
        "count": len(customers),
        "customers": [c.to_dict() for c in customers],
    })


@api.get("/admin/subscribers")
def admin_get_subscribers():
    subscribers = Subscriber.query.order_by(Subscriber.created_at.desc()).all()
    return jsonify({
        "count": len(subscribers),
        "subscribers": [s.to_dict() for s in subscribers],
    })
