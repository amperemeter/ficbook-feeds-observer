const scrape = require("./scrape");
const proto = require('./proto');

const readCollection = async(fanfics, saveCount) => {
  console.log(`Всего фэндомов: ${fanfics.length}\n`);
  console.time("Время работы");

  const fanficsCopied = [];

  for (let i = 0; i < fanfics.length; i++) {
    const fanfic = Object.assign({}, proto);
    fanfic.id = fanfics[i]._id;
    fanfic.name = fanfics[i].name;
    fanfic.url = fanfics[i].url;
    fanfic.oldArticleCount = fanfics[i].count;
    fanficsCopied.push(fanfic);
  }

  for (const fanfic of fanficsCopied) {
    await scrape(fanfic, saveCount);
  }

  console.timeEnd("Время работы");
}

module.exports = readCollection;