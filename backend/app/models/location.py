import uuid

from sqlmodel import Field, Relationship, SQLModel

from .address import Address, AddressRead


class LocationBase(SQLModel):
    name: str
    stephen_coffee: float = Field(ge=0, le=5)
    sans_coffee: float = Field(ge=0, le=5)
    ambience: float | None = Field(default=None, ge=0, le=5)
    food: float | None = Field(default=None, ge=0, le=5)
    image_url: str | None = None


class Location(LocationBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    address_id: uuid.UUID = Field(foreign_key="address.id")
    address: Address | None = Relationship(back_populates="locations")


class LocationCreate(LocationBase):
    address_id: uuid.UUID


class LocationRead(LocationBase):
    id: uuid.UUID
    address: AddressRead
