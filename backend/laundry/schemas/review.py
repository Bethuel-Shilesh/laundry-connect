from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReviewCreate(BaseModel):
    shop_id: int
    order_id: int
    rating: float
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    customer_id: int
    shop_id: int
    order_id: int
    rating: float
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
