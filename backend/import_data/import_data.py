import sqlite3
from azure.data.tables import TableClient
from azure.identity import DefaultAzureCredential
import os
from pprint import pprint

con = sqlite3.connect("db.sqlite3")
cur = con.cursor()

locations_table = TableClient(
    endpoint="https://streviewmapdeveau001.table.core.windows.net",
    table_name="locations",
    credential=DefaultAzureCredential(),
)

categories_table = TableClient(
    endpoint="https://streviewmapdeveau001.table.core.windows.net",
    table_name="categories",
    credential=DefaultAzureCredential(),
)

cafes = cur.execute("SELECT * FROM map_cafe").fetchall()
for cafe in cafes:
    (
        id_val,
        name,
        food_rating,
        ambience_rating,
        review,
        latitude,
        longitude,
        sans_coffee,
        stephen_coffee,
        image_url,
        address,
        _,
    ) = cafe

    item = {
        "PartitionKey": "Cafe",
        "RowKey": str(id_val - 1),
        "Name": name,
        "Latitude": latitude,
        "Longitude": longitude,
        "Address": address,
        "Generic1": food_rating,
        "Generic2": ambience_rating,
        "Generic3": None,
        "Special": (sans_coffee + stephen_coffee) / 2,
        "SpecialSans": sans_coffee,
        "SpecialStephen": stephen_coffee,
        "ImageURL": (
            f"https://streviewmapdeveau001.blob.core.windows.net/assets/Cafe/{id_val}.png"
            if id_val < 6
            else None
        ),
    }

    pprint(item)
    locations_table.upsert_entity(item)

cafe_item = {
    "PartitionKey": "Cafe",
    "RowKey": "0",
    "Generic1": "Food Rating",
    "Generic2": "Ambience Rating",
    "Generic3": None,
    "Special": "Coffee Rating",
}
categories_table.upsert_entity(cafe_item)
