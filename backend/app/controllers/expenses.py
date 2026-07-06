from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.expense import Expense, ExpenseSplit
from app.models.user import User
from app.schemas.expense import ExpenseCreate, ExpenseOut
from app.services.expense_service import calculate_splits

router = APIRouter(prefix="/groups/{group_id}/expenses", tags=["expenses"])


@router.post("", response_model=ExpenseOut)
def create_expense(
    group_id: int,
    payload: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    shares = calculate_splits(payload)

    expense = Expense(
        group_id=group_id,
        paid_by=current_user.id,
        description=payload.description,
        amount=payload.amount,
        category=payload.category,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)

    for user_id, share in shares.items():
        db.add(ExpenseSplit(expense_id=expense.id, user_id=user_id, share_amount=share))
    db.commit()
    db.refresh(expense)

    return expense


@router.get("", response_model=list[ExpenseOut])
def list_expenses(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Expense).filter(Expense.group_id == group_id).all()


@router.delete("/{expense_id}")
def delete_expense(
    group_id: int,
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = (
        db.query(Expense)
        .filter(Expense.id == expense_id, Expense.group_id == group_id)
        .first()
    )
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(expense)
    db.commit()
    return {"status": "deleted"}