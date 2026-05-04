import uuid
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .location import Location


class AddressBase(SQLModel):
    formatted_address: str
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)


class Address(AddressBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    locations: list["Location"] = Relationship(back_populates="address")


class AddressCreate(AddressBase):
    pass


class AddressRead(AddressBase):
    id: uuid.UUID
