from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ShopCreate(BaseModel):
    shop_name: str
    address: str
    city: str
    phone: Optional[str] = None
    description: Optional[str] = None

class ShopResponse(BaseModel):
    id: int
    owner_id: int
    shop_name: str
    address: str
    city: str
    phone: Optional[str] = None
    description: Optional[str] = None
    rating: float
    is_approved: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True 
