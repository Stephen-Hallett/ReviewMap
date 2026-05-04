import uuid

from sqlalchemy.orm import selectinload
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models import Location, LocationCreate, LocationRead


async def get_locations(session: AsyncSession) -> list[LocationRead]:
    result = await session.exec(
        select(Location).options(selectinload(Location.address))
    )
    return result.all()


async def get_location(
    location_id: uuid.UUID, session: AsyncSession
) -> Location | None:
    result = await session.exec(
        select(Location)
        .where(Location.id == location_id)
        .options(selectinload(Location.address))
    )
    return result.first()


async def create_location(data: LocationCreate, session: AsyncSession) -> Location:
    location = Location.model_validate(data)
    session.add(location)
    await session.commit()
    await session.refresh(location)
    await session.refresh(location, ["address"])
    return location


async def update_image_url(
    location: Location, image_url: str, session: AsyncSession
) -> Location:
    location.image_url = image_url
    session.add(location)
    await session.commit()
    await session.refresh(location)
    return location


async def delete_location(location: Location, session: AsyncSession) -> None:
    await session.delete(location)
    await session.commit()
