const fs = require('file-system');
const readCollection = require('./tools/read-collection');
const fanfics = require('./data/fanfics');

(async function() {
  const changedFanfics = [];

  const saveCount = (obj) => {
    changedFanfics.push({
      "name": obj.name,
      "url": obj.url,
      "count": obj.articleCount
    });
  };

  await readCollection(fanfics, saveCount);

  if (changedFanfics.length) {
    await fs.writeFileSync('./data/fanfics.json', JSON.stringify(changedFanfics, null, 2));
  } else {
    console.log("Ошибка. Данные не могут быть сохранены");
  }
})();