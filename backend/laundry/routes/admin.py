from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from laundry.database import get_db
from laundry.models.shop import Shop
from laundry.models.user import User
from laundry.models.order import Order
from laundry.schemas.shop import ShopResponse
from laundry.utils.auth import verify_token
from fastapi.security import OAuth2PasswordBearer
from typing import List

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
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

def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can access this")
    return current_user

@router.get("/stats")
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    total_users = db.query(User).count()
    total_shops = db.query(Shop).count()
    total_orders = db.query(Order).count()
    return {
        "total_users": total_users,
        "total_shops": total_shops,
        "total_orders": total_orders
    }

@router.get("/shops/pending", response_model=List[ShopResponse])
def get_pending_shops(db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    shops = db.query(Shop).filter(Shop.is_approved == False).all()
    return shops

@router.put("/shops/{shop_id}/approve", response_model=ShopResponse)
def approve_shop(shop_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    shop.is_approved = True
    db.commit()
    db.refresh(shop)
    return shop

@router.get("/users", response_model=List[dict])
def get_all_users(db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    users = db.query(User).all()
    return [{"id": u.id, "full_name": u.full_name, "email": u.email, "role": u.role, "is_active": u.is_active} for u in users]

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit()
    return {"message": "User deactivated successfully"} 
