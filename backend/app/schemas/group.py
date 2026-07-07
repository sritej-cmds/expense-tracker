from typing import List

from pydantic import BaseModel, field_validator

from app.schemas.user import UserOut


class GroupCreate(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Group name cannot be empty")
        return stripped


class GroupOut(BaseModel):
    id: int
    name: str
    created_by: int

    class Config:
        from_attributes = True


class GroupMemberAdd(BaseModel):
    user_id: int


class GroupDetail(GroupOut):
    members: List[UserOut] = []