import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlmodel.ext.asyncio.session import AsyncSession

import app.API.locations as location_api
from app.models import LocationCreate, LocationRead
from app.utils.db import get_session
from app.utils.storage import upload_image

router = APIRouter()

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.get("/", response_model=list[LocationRead])
async def get_locations(
    session: AsyncSession = Depends(get_session),  # noqa: B008
) -> list[LocationRead]:
    return await location_api.get_locations(session)


@router.get("/{location_id}", response_model=LocationRead)
async def get_location(
    location_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),  # noqa: B008
) -> LocationRead:
    location = await location_api.get_location(location_id, session)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location


@router.post("/", response_model=LocationRead, status_code=201)
async def create_location(
    data: LocationCreate,
    session: AsyncSession = Depends(get_session),  # noqa: B008
) -> LocationRead:
    return await location_api.create_location(data, session)


@router.post("/{location_id}/image", response_model=LocationRead)
async def upload_location_image(
    location_id: uuid.UUID,
    file: UploadFile,
    session: AsyncSession = Depends(get_session),  # noqa: B008
) -> LocationRead:
    location = await location_api.get_location(location_id, session)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="File must be a JPEG, PNG, or WebP image",
        )

    extension = Path(file.filename or "").suffix or ".jpg"
    image_url = upload_image(await file.read(), file.content_type, extension)
    return await location_api.update_image_url(location, image_url, session)


@router.delete("/{location_id}", status_code=204)
async def delete_location(
    location_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),  # noqa: B008
) -> None:
    location = await location_api.get_location(location_id, session)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    await location_api.delete_location(location, session)
