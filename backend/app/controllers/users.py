from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.user import UserOut

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get("", response_model=list[UserOut])
def list_users(
    search: str | None = Query(
        None, description="Regex pattern matched against email or name"
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(User)

    if search:
        query = query.filter(
            or_(
                User.email.op("~*")(search),
                User.name.op("~*")(search),
            )
        )

    return query.all()
