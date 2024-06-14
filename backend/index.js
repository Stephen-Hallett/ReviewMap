const express = require('express');
const cors = require('cors');
const { TableServiceClient, TableClient, AzureNamedKeyCredential, odata } = require("@azure/data-tables");
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const connectionString = process.env.AZURE_TABLE_CONNECTION

const locationsClient = TableClient.fromConnectionString(connectionString, 'locations');
const categoriesClient = TableClient.fromConnectionString(connectionString, 'categories');

async function fetchEntities() {
    const entities = locationsClient.listEntities({
        queryOptions: {}
    });

    let topEntities = [];
    const iterator = entities.byPage();

    for await (const page of iterator) {
        topEntities = page;
        break;
    }
    return(topEntities);
}


app.use(cors())

app.listen(8080, () => {
    console.log('listening on port 8080')
})

app.get('/', (req, res) => {
    res.send('server is alive!')
})

app.get('/locations', async (req, res) => {
    try {
        const topEntities = await fetchEntities();
        res.json(topEntities);
    } catch (error) {
        console.error('Error fetching entities:', error);
        res.status(500).send('Error fetching entities');
    }
})