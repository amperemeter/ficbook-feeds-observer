const fs = require('file-system'),
  Proto = require('./tools/proto'),
  ReadCollection = require('./tools/read-collection'),
  fanfics = require('./data/fanfics');

(async function() {
  const changedFanfics = [];

  const saveCount = (obj) => {
    changedFanfics.push({
      "name": obj.name,
      "url": obj.url,
      "count": obj.articleCount
    });
  };

  await ReadCollection(fanfics, Proto, saveCount);

  if (fanfics.length === changedFanfics.length) {
    await fs.writeFileSync('./data/fanfics.json', JSON.stringify(changedFanfics, null, 2));
  } else {
    console.log("Ошибка. Данные не могут быть сохранены");
  }
})();