from fastapi import HTTPException
from app.schemas.expense import ExpenseCreate, SplitType


def calculate_splits(payload: ExpenseCreate) -> dict[int, float]:
    n = len(payload.participants)
    if n == 0:
        raise HTTPException(status_code=400, detail="At least one participant required")

    if payload.split_type == SplitType.equal:
        share = round(payload.amount / n, 2)
        return {p.user_id: share for p in payload.participants}

    if payload.split_type == SplitType.exact:
        total = sum(p.value or 0 for p in payload.participants)
        if round(total, 2) != round(payload.amount, 2):
            raise HTTPException(
                status_code=400,
                detail="Exact splits must add up to the total amount",
            )
        return {p.user_id: p.value or 0 for p in payload.participants}

    if payload.split_type == SplitType.percentage:
        total_pct = sum(p.value or 0 for p in payload.participants)
        if round(total_pct, 2) != 100.0:
            raise HTTPException(
                status_code=400, detail="Percentages must add up to 100"
            )
        return {
            p.user_id: round(payload.amount * (p.value or 0) / 100, 2)
            for p in payload.participants
        }

    raise HTTPException(status_code=400, detail="Unsupported split type")