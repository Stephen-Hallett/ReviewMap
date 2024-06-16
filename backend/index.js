const express = require("express");
const cors = require("cors");
const {
  TableServiceClient,
  TableClient,
  odata,
} = require("@azure/data-tables");
const dotenv = require("dotenv");
dotenv.config();
const Ajv = require("ajv");
const ajv = new Ajv();

const { categorySchema, locationSchema } = require("./db_schemas.js");

const connectionString = process.env.AZURE_TABLE_CONNECTION;

const locationsClient = TableClient.fromConnectionString(
  connectionString,
  "locations"
);
const categoriesClient = TableClient.fromConnectionString(
  connectionString,
  "categories"
);

const validateCategory = ajv.compile(categorySchema);
const validateLocation = ajv.compile(locationSchema);

async function fetchEntities(endpoint, filters = null) {
  let client;
  if (endpoint == "location") {
    client = locationsClient;
  } else if (endpoint == "category") {
    client = categoriesClient;
  }

  let entities;
  if (filters == null) {
    entities = client.listEntities({});
  } else {
    console.log(filters);
    entities = client.listEntities({
      queryOptions: { filter: filters },
    });
  }
  let topEntities = [];
  const iterator = entities.byPage();

  for await (const page of iterator) {
    topEntities = page;
    break;
  }
  return topEntities;
}

async function postEntity(endpoint, entity) {
  let client;
  let validate;
  if (endpoint == "location") {
    client = locationsClient;
    validate = validateLocation;
  } else if (endpoint == "category") {
    client = categoriesClient;
    validate = validateCategory;
  }

  const isValid = validate(data);
  if (!isValid) {
    console.error("Validation errors:", validate.errors);
  } else {
    console.log(
      `Upserting ${entity["PartitionKey"]} ${endpoint} with ID ${entity["RowKey"]}`
    );
    client.upsertEntity(entity);
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const app = express();
app.use(cors());
app.use(express.json());

app.listen(8080, () => {
  console.log("listening on port 8080");
});

app.get("/", (req, res) => {
  res.send("server is alive!");
});

app.get("/location", async (req, res) => {
  try {
    const queries = req.query;
    let filters = [];
    Object.keys(queries).forEach(function (key) {
      filters.push(capitalize(`${key} eq ${queries[key]}`));
    });
    const topEntities = await fetchEntities("locations", filters.join(" and "));
    res.json(topEntities);
  } catch (error) {
    console.error("Error fetching entities:", error);
    res.status(500).send("Error fetching entities");
  }
});

app.get("/category", async (req, res) => {
  try {
    const queries = req.query;
    let filters = [];
    Object.keys(queries).forEach(function (key) {
      filters.push(capitalize(odata`${key} eq ${queries[key]}`));
    });
    const topEntities = await fetchEntities(
      "categories",
      filters.join(" and ")
    );
    res.json(topEntities);
  } catch (error) {
    console.error("Error fetching entities:", error);
    res.status(500).send("Error fetching entities");
  }
});

app.post("/locations", async (req, res) => {
  try {
  } catch (error) {}
});
