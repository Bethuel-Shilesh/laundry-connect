from pydantic import BaseModel
from typing import Optional

class ServiceCreate(BaseModel):
    service_name: str
    description: Optional[str] = None
    price_per_item: float
    estimated_time: Optional[str] = None

class ServiceResponse(BaseModel):
    id: int
    shop_id: int
    service_name: str
    description: Optional[str] = None
    price_per_item: float
    estimated_time: Optional[str] = None
    is_available: bool

    class Config:
        from_attributes = True


