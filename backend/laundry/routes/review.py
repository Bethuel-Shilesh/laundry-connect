from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from laundry.database import get_db
from laundry.models.review import Review
from laundry.models.shop import Shop
from laundry.models.user import User
from laundry.schemas.review import ReviewCreate, ReviewResponse
from laundry.utils.auth import verify_token
from fastapi.security import OAuth2PasswordBearer
from typing import List

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"]
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

@router.post("/", response_model=ReviewResponse)
def create_review(review: ReviewCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing_review = db.query(Review).filter(Review.order_id == review.order_id).first()
    if existing_review:
        raise HTTPException(status_code=400, detail="Review already exists for this order")
    if review.rating < 1 or review.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    new_review = Review(
        customer_id=current_user.id,
        shop_id=review.shop_id,
        order_id=review.order_id,
        rating=review.rating,
        comment=review.comment
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    shop = db.query(Shop).filter(Shop.id == review.shop_id).first()
    if shop:
        reviews = db.query(Review).filter(Review.shop_id == review.shop_id).all()
        shop.rating = sum(r.rating for r in reviews) / len(reviews)
        db.commit()
    return new_review

@router.get("/{shop_id}", response_model=List[ReviewResponse])
def get_shop_reviews(shop_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.shop_id == shop_id).all()
    return reviews
