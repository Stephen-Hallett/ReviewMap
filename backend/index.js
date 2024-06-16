const express = require('express');
const cors = require('cors');
const { TableServiceClient, TableClient, AzureNamedKeyCredential, odata } = require("@azure/data-tables");
const dotenv = require('dotenv');
dotenv.config();

const connectionString = process.env.AZURE_TABLE_CONNECTION

const locationsClient = TableClient.fromConnectionString(connectionString, 'locations');
const categoriesClient = TableClient.fromConnectionString(connectionString, 'categories');

async function fetchEntities(filters = null) {
    let entities;
    if (filters == null){
        entities = locationsClient.listEntities({});
    } else {
        console.log(filters)
        entities = locationsClient.listEntities({
            queryOptions: {filter: filters}
        });
    }
    let topEntities = [];
    const iterator = entities.byPage();

    for await (const page of iterator) {
        topEntities = page;
        break;
    }
    return(topEntities);
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const app = express();
app.use(cors())
app.use(express.json())

app.listen(8080, () => {
    console.log('listening on port 8080')
})

app.get('/', (req, res) => {
    res.send('server is alive!')
})

app.get('/locations', async (req, res) => {
    try {
        const queries = req.query;
        let filters = [];
        Object.keys(queries).forEach(function(key) { 
            filters.push(capitalize(odata`${key} eq ${queries[key]}`));
        })
        const topEntities = await fetchEntities(filters.join(" and "));
        res.json(topEntities);
    } catch (error) {
        console.error('Error fetching entities:', error);
        res.status(500).send('Error fetching entities');
    }
})