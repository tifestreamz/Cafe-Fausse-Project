from datetime import datetime

from .extensions import db


class Customer(db.Model):
    __tablename__ = "customers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    phone = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    reservations = db.relationship("Reservation", back_populates="customer")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Subscriber(db.Model):
    __tablename__ = "subscribers"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Reservation(db.Model):
    __tablename__ = "reservations"

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False)
    time_slot = db.Column(db.DateTime, nullable=False, index=True)
    guests = db.Column(db.Integer, nullable=False)
    table_number = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    customer = db.relationship("Customer", back_populates="reservations")

    __table_args__ = (
        db.UniqueConstraint("time_slot", "table_number", name="uq_slot_table"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "guest_name": self.customer.name if self.customer else "Guest",
            "email": self.customer.email if self.customer else "",
            "phone": self.customer.phone if self.customer else "",
            "time_slot": self.time_slot.isoformat() if self.time_slot else None,
            "date": self.time_slot.strftime("%Y-%m-%d") if self.time_slot else None,
            "hour": self.time_slot.strftime("%H:%M") if self.time_slot else None,
            "guests": self.guests,
            "table_number": self.table_number,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
