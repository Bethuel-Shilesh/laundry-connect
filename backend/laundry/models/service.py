from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from laundry.database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("laundry_shops.id"), nullable=False)
    service_name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price_per_item = Column(Float, nullable=False)
    estimated_time = Column(String, nullable=True)  # e.g. "2 days"
    is_available = Column(Boolean, default=True)

    shop = relationship("Shop", backref="services")
