import uuid

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models import Address, AddressCreate


async def get_addresses(session: AsyncSession) -> list[Address]:
    result = await session.exec(select(Address))
    return result.all()


async def get_address(address_id: uuid.UUID, session: AsyncSession) -> Address | None:
    return await session.get(Address, address_id)


async def create_address(data: AddressCreate, session: AsyncSession) -> Address:
    address = Address.model_validate(data)
    session.add(address)
    await session.commit()
    await session.refresh(address)
    return address


async def delete_address(address: Address, session: AsyncSession) -> None:
    await session.delete(address)
    await session.commit()
