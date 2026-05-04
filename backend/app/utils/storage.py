import uuid

from azure.storage.blob import BlobServiceClient

from app.config import settings


def upload_image(file_bytes: bytes, content_type: str, extension: str) -> str:
    filename = f"{uuid.uuid4()}{extension}"
    client = BlobServiceClient.from_connection_string(settings.azure_storage_connection)
    blob = client.get_blob_client(
        container=settings.azure_storage_container, blob=filename
    )
    blob.upload_blob(
        file_bytes,
        overwrite=True,
        content_settings={"content_type": content_type},
    )
    return blob.url
