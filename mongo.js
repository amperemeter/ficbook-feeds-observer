const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const uri = require('./data/uri');
const readCollection = require('./tools/read-collection');

MongoClient.connect(uri, async function (err, client) {
  assert.equal(null, err);
  const collection = client.db('fanficsdb').collection('fanfics');
  const fanfics = await collection.find({}).toArray();

  const saveCount = async (obj) => {
    try {
      const difference = obj.isNew();

      if (difference !== 0) {
        await collection.updateOne({url: obj.url}, {$set: {count: obj.articleCount}});
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  await readCollection(fanfics, saveCount);
  await client.close(); // закрыть подключение с БД
});