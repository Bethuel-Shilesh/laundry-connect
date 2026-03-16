from fastapi import FastAPI
from laundry.database import engine, Base
from laundry.models import User, Shop, Service, Order, Review, Payment

# Create all tables in database
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Laundry Connect API",
    description="Smart Laundry Management Platform",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "Welcome to Laundry Connect API!"} 
