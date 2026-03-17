from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from laundry.database import get_db
from laundry.models.shop import Shop
from laundry.models.user import User
from laundry.schemas.shop import ShopCreate, ShopResponse
from laundry.utils.auth import verify_token
from fastapi.security import OAuth2PasswordBearer
from typing import List

router = APIRouter(
    prefix="/shops",
    tags=["Laundry Shops"]
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

@router.post("/", response_model=ShopResponse)
def create_shop(shop: ShopCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "owner":
        raise HTTPException(status_code=403, detail="Only owners can create shops")
    new_shop = Shop(
        owner_id=current_user.id,
        shop_name=shop.shop_name,
        address=shop.address,
        city=shop.city,
        phone=shop.phone,
        description=shop.description
    )
    db.add(new_shop)
    db.commit()
    db.refresh(new_shop)
    return new_shop

@router.get("/", response_model=List[ShopResponse])
def get_all_shops(db: Session = Depends(get_db)):
    shops = db.query(Shop).filter(Shop.is_approved == True, Shop.is_active == True).all()
    return shops

@router.get("/{shop_id}", response_model=ShopResponse)
def get_shop(shop_id: int, db: Session = Depends(get_db)):
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    return shop

@router.put("/{shop_id}", response_model=ShopResponse)
def update_shop(shop_id: int, shop: ShopCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_shop = db.query(Shop).filter(Shop.id == shop_id, Shop.owner_id == current_user.id).first()
    if not db_shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    db_shop.shop_name = shop.shop_name
    db_shop.address = shop.address
    db_shop.city = shop.city
    db_shop.phone = shop.phone
    db_shop.description = shop.description
    db.commit()
    db.refresh(db_shop)
    return db_shop

@router.delete("/{shop_id}")
def delete_shop(shop_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_shop = db.query(Shop).filter(Shop.id == shop_id, Shop.owner_id == current_user.id).first()
    if not db_shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    db_shop.is_active = False
    db.commit()
    return {"message": "Shop deleted successfully"} 
