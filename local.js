const fs = require("file-system");
const { readCollection } = require("./tools/read-collection");
const fanfics = require("./data/fanfics");

const app = async () => {
  const changedFanfics = [];

  await readCollection(fanfics, { changedFanfics });

  if (fanfics.length === changedFanfics.length) {
    await fs.writeFileSync(
      "./data/fanfics.json",
      JSON.stringify(changedFanfics, null, 2),
    );
  } else {
    console.log("Ошибка. Данные не могут быть сохранены");
  }
};

module.exports = app;
