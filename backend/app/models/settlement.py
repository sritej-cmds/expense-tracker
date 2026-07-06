from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, func
from app.core.database import Base


class Settlement(Base):
    __tablename__ = "settlements"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    paid_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    paid_to = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    settled_at = Column(DateTime(timezone=True), server_default=func.now())