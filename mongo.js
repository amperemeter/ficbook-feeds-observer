const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const uri = require('./data/uri');
const readCollection = require('./tools/read-collection');

MongoClient.connect(uri, async function (err, client) {
  assert.equal(null, err);
  const collection = client.db('fanficsdb').collection('fanfics');
  const fanfics = await collection.find({}).toArray();

  await readCollection(fanfics, {collection});
  await client.close(); // закрыть подключение с БД
});