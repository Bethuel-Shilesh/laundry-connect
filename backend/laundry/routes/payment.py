from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from laundry.database import get_db
from laundry.models.payment import Payment
from laundry.models.order import Order
from laundry.models.user import User
from laundry.schemas.payment import PaymentCreate, PaymentResponse
from laundry.utils.auth import verify_token
from fastapi.security import OAuth2PasswordBearer
from typing import List

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=PaymentResponse)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == payment.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    existing_payment = db.query(Payment).filter(Payment.order_id == payment.order_id).first()
    if existing_payment:
        raise HTTPException(status_code=400, detail="Payment already exists for this order")
    new_payment = Payment(
        order_id=payment.order_id,
        customer_id=current_user.id,
        amount=payment.amount,
        payment_method=payment.payment_method,
        transaction_status="completed"
    )
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment

@router.get("/", response_model=List[PaymentResponse])
def get_my_payments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    payments = db.query(Payment).filter(Payment.customer_id == current_user.id).all()
    return payments

@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment 
