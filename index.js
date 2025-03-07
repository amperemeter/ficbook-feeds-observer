const needle = require("needle");
const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;
const { readCollection } = require("./tools/read-collection");
const { timeout } = require("./tools/utils");

const options = {
  open_timeout: 60000,
  user_agent: "MyApp/1.2.3",
  parse_response: false,
};

const app = (uri, databaseName = "fanficsdb", collectionName = "fanfics") => {
  MongoClient.connect(uri, async (err, client) => {
    assert.equal(null, err);

    const collection = client.db(databaseName).collection(collectionName);
    const fanfics = await collection.find({}).toArray();

    await needle("get", "https://ficbook.net/", options);
    await timeout(1000);
  
    await readCollection(fanfics, options, { collection });
    await client.close(); // закрыть подключение с БД
  });
};

module.exports = app;
