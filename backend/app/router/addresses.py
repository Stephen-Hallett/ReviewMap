import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession

import app.API.addresses as address_api
from app.models import AddressCreate, AddressRead
from app.utils.db import get_session

router = APIRouter()


@router.get("/", response_model=list[AddressRead])
async def get_addresses(
    session: AsyncSession = Depends(get_session),  # noqa: B008
) -> list[AddressRead]:
    return await address_api.get_addresses(session)


@router.post("/", response_model=AddressRead, status_code=201)
async def create_address(
    data: AddressCreate,
    session: AsyncSession = Depends(get_session),  # noqa: B008
) -> AddressRead:
    return await address_api.create_address(data, session)


@router.delete("/{address_id}", status_code=204)
async def delete_address(
    address_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),  # noqa: B008
) -> None:
    address = await address_api.get_address(address_id, session)
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    await address_api.delete_address(address, session)
