from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.settlement import Settlement
from app.models.user import User
from app.schemas.settlement import SettlementCreate, SettlementOut, BalanceEntry
from app.services.settlement_service import compute_net_balances, simplify_debts

router = APIRouter(prefix="/groups/{group_id}", tags=["settlements"])


@router.get("/balances", response_model=list[BalanceEntry])
def get_balances(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    net = compute_net_balances(db, group_id)
    return simplify_debts(net)


@router.post("/settlements", response_model=SettlementOut)
def create_settlement(
    group_id: int,
    payload: SettlementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    settlement = Settlement(
        group_id=group_id,
        paid_by=current_user.id,
        paid_to=payload.paid_to,
        amount=payload.amount,
    )
    db.add(settlement)
    db.commit()
    db.refresh(settlement)
    return settlement


@router.get("/settlements", response_model=list[SettlementOut])
def list_settlements(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Settlement).filter(Settlement.group_id == group_id).all()