const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const {readCollection} = require('./tools/read-collection');
const uri = require('./data/uri');

MongoClient.connect(uri, async (err, client) => {
  assert.equal(null, err);
  const collection = client.db('f anficsdb').collection('fanfics');
  const fanfics = await collection.find({}).toArray();

  await readCollection(fanfics, {collection});
  await client.close(); // закрыть подключение с БД
});