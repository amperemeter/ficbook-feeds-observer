const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;
const { readCollection } = require("./tools/read-collection");

const app = (uri) => {
  MongoClient.connect(uri, async (err, client) => {
    assert.equal(null, err);
    const collection = client.db("fanficsdb").collection("fanfics");
    const fanfics = await collection.find({}).toArray();

    await readCollection(fanfics, { collection });
    await client.close(); // закрыть подключение с БД
  });
};

module.exports = app;
