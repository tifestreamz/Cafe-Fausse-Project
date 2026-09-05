from datetime import datetime
from .extensions import db
from .models import Customer, Reservation


def seed_initial_data():
    """Seed initial realistic demo reservations and subscribers if database is fresh."""
    try:
        if Customer.query.filter_by(newsletter_signup=True).count() == 0:
            demo_subs = [
                {"name": "Michelin Guide Editorial", "email": "gourmet.guide@michelin.com", "phone": "(202) 555-0199"},
                {"name": "Tuscany Sommelier Club", "email": "sommelier.club@tuscany-wine.it", "phone": "(202) 555-0142"},
                {"name": "Elena Vance", "email": "patron.elena@gmail.com", "phone": "(202) 555-0178"},
                {"name": "Capitol Eats Review", "email": "foodie.dc@capitol-eats.org", "phone": "(202) 555-0125"},
                {"name": "Gastronomy Artisan Journal", "email": "artisan.tastes@gastronomy.com", "phone": "(202) 555-0164"},
            ]
            for sub in demo_subs:
                existing = Customer.query.filter_by(email=sub["email"]).first()
                if not existing:
                    db.session.add(Customer(name=sub["name"], email=sub["email"], phone=sub["phone"], newsletter_signup=True))
                else:
                    if not existing.name:
                        existing.name = sub["name"]
                    if not existing.phone:
                        existing.phone = sub["phone"]
                    existing.newsletter_signup = True
            db.session.commit()

        if Reservation.query.count() <= 1:
            initial_bookings = [
                {
                    "name": "Elena Rostova",
                    "email": "elena@example.com",
                    "phone": "(555) 345-6789",
                    "date_str": "2026-09-05 18:30",
                    "guests": 4,
                    "table_number": 4,
                },
                {
                    "name": "Matteo Ricci",
                    "email": "matteo@luxury-milan.it",
                    "phone": "(555) 890-4321",
                    "date_str": "2026-09-05 19:00",
                    "guests": 2,
                    "table_number": 7,
                },
                {
                    "name": "Isabella Vivaldi",
                    "email": "isabella.v@sommelier.org",
                    "phone": "(555) 234-9876",
                    "date_str": "2026-09-05 19:30",
                    "guests": 6,
                    "table_number": 12,
                },
                {
                    "name": "Marco Bellini",
                    "email": "marco@example.com",
                    "phone": "(555) 890-1234",
                    "date_str": "2026-09-05 20:00",
                    "guests": 2,
                    "table_number": 18,
                },
                {
                    "name": "Claire DuPont",
                    "email": "c.dupont@vogue-paris.fr",
                    "phone": "(555) 678-1122",
                    "date_str": "2026-09-05 20:30",
                    "guests": 4,
                    "table_number": 25,
                },
            ]
            for b in initial_bookings:
                cust = Customer.query.filter_by(email=b["email"]).first()
                if not cust:
                    cust = Customer(name=b["name"], email=b["email"], phone=b["phone"])
                    db.session.add(cust)
                    db.session.flush()
                slot = datetime.strptime(b["date_str"], "%Y-%m-%d %H:%M")
                existing_res = Reservation.query.filter_by(time_slot=slot, table_number=b["table_number"]).first()
                if not existing_res:
                    res = Reservation(customer=cust, time_slot=slot, guests=b["guests"], table_number=b["table_number"])
                    db.session.add(res)
            db.session.commit()
    except Exception as e:
        db.session.rollback()
        # Non-fatal during app initialization
        print(f"Seed warning: {e}")
