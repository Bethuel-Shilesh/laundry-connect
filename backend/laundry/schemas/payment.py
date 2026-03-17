from pydantic import BaseModel
from datetime import datetime

class PaymentCreate(BaseModel):
    order_id: int
    amount: float
    payment_method: str

class PaymentResponse(BaseModel):
    id: int
    order_id: int
    customer_id: int
    amount: float
    payment_method: str
    transaction_status: str
    created_at: datetime

    class Config:
        from_attributes = True 
