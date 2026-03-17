from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from laundry.database import get_db
from laundry.models.service import Service
from laundry.models.shop import Shop
from laundry.models.user import User
from laundry.schemas.service import ServiceCreate, ServiceResponse
from laundry.utils.auth import verify_token
from fastapi.security import OAuth2PasswordBearer
from typing import List

router = APIRouter(
    prefix="/services",
    tags=["Services"]
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

@router.post("/", response_model=ServiceResponse)
def create_service(service: ServiceCreate, shop_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    shop = db.query(Shop).filter(Shop.id == shop_id, Shop.owner_id == current_user.id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    new_service = Service(
        shop_id=shop_id,
        service_name=service.service_name,
        description=service.description,
        price_per_item=service.price_per_item,
        estimated_time=service.estimated_time
    )
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service

@router.get("/{shop_id}", response_model=List[ServiceResponse])
def get_services(shop_id: int, db: Session = Depends(get_db)):
    services = db.query(Service).filter(Service.shop_id == shop_id, Service.is_available == True).all()
    return services

@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(service_id: int, service: ServiceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    db_service.service_name = service.service_name
    db_service.description = service.description
    db_service.price_per_item = service.price_per_item
    db_service.estimated_time = service.estimated_time
    db.commit()
    db.refresh(db_service)
    return db_service

@router.delete("/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    db_service.is_available = False
    db.commit()
    return {"message": "Service deleted successfully"}  
