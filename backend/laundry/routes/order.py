from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from laundry.database import get_db
from laundry.models.order import Order
from laundry.models.service import Service
from laundry.models.user import User
from laundry.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate
from laundry.utils.auth import verify_token
from fastapi.security import OAuth2PasswordBearer
from typing import List

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
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

@router.post("/", response_model=OrderResponse)
def create_order(order: OrderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = db.query(Service).filter(Service.id == order.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    total_price = service.price_per_item * order.quantity
    new_order = Order(
        customer_id=current_user.id,
        shop_id=order.shop_id,
        service_id=order.service_id,
        quantity=order.quantity,
        total_price=total_price,
        pickup_date=order.pickup_date,
        delivery_date=order.delivery_date
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/", response_model=List[OrderResponse])
def get_my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    orders = db.query(Order).filter(Order.customer_id == current_user.id).all()
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(order_id: int, status_update: OrderStatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if current_user.role not in ["owner", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to update order status")
    valid_statuses = ["pending", "accepted", "washing", "ready", "delivered"]
    if status_update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    order.status = status_update.status
    db.commit()
    db.refresh(order)
    return order
