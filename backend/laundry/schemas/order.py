from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OrderCreate(BaseModel):
    shop_id: int
    service_id: int
    quantity: int
    pickup_date: datetime
    delivery_date: datetime

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    shop_id: int
    service_id: int
    quantity: int
    total_price: float
    pickup_date: datetime
    delivery_date: datetime
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str
