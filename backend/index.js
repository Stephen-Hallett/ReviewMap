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
  if (endpoint === "location") {
    client = locationsClient;
  } else if (endpoint === "category") {
    client = categoriesClient;
  }

  let entities;
  if (filters == null) {
    entities = client.listEntities();
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
  if (endpoint === "location") {
    client = locationsClient;
    validate = validateLocation;
  } else if (endpoint === "category") {
    client = categoriesClient;
    validate = validateCategory;
  } else {
    console.error("Endpoint Not Defined");
  }

  const isValid = validate(entity);
  if (!isValid) {
    console.log("Validation errors:", validate.errors);
    return 404;
  } else {
    console.log(
      `Upserting ${entity["partitionKey"]} ${endpoint} with ID ${entity["rowKey"]}`
    );
    let result = await client.upsertEntity(entity, "Merge");
    console.log(result);
    return 200;
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
    const topEntities = await fetchEntities("location", filters.join(" and "));
    res.json(topEntities);
  } catch (error) {
    console.error("Error fetching entities:", error);
    res.status(500).send("Error fetching locations");
  }
});

app.get("/category", async (req, res) => {
  try {
    const queries = req.query;
    let filters = [];
    Object.keys(queries).forEach(function (key) {
      filters.push(capitalize(odata`${key} eq ${queries[key]}`));
    });
    const topEntities = await fetchEntities("category", filters.join(" and "));
    res.json(topEntities);
  } catch (error) {
    console.error("Error fetching entities:", error);
    res.status(500).send("Error fetching categories");
  }
});

app.post("/category", async (req, res) => {
  try {
    const entity = req.body;
    const status = await postEntity("category", entity);
    res.status(status);
    if (status === 200) {
      res.send(
        `${entity["partitionKey"]} Category with ID ${entity["RowKey"]} Successfully created!`
      );
    } else if (status === 404) {
      res.send("Failed to upsert the entity due to schema violations");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error posting category");
  }
});

app.post("/location", async (req, res) => {
  try {
    const entity = req.body;
    const status = await postEntity("location", entity);
    res.status(status);
    if (status === 200) {
      res.send(
        `${entity["partitionKey"]} Location with ID ${entity["RowKey"]} Successfully created!`
      );
    } else if (status === 404) {
      res.send("Failed to upsert the entity due to schema violations");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error posting location");
  }
});
