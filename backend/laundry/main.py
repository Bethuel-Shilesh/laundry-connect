from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from laundry.database import engine, Base
from laundry.models import User, Shop, Service, Order, Review, Payment
from laundry.routes import auth, shop, order

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Laundry Connect API",
    description="Smart Laundry Management Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(shop.router)
app.include_router(order.router)

@app.get("/")
def root():
    return {"message": "Welcome to Laundry Connect API!"}
