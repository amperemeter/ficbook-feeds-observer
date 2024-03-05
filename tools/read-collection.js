const {scrape} = require("./scrape");
const {proto} = require('./proto');

module.exports.readCollection = async (fanfics, props) => {
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

  for (let i = 0; i < fanficsCopied.length; i++) {
    await scrape(fanficsCopied[i], props);
    // console.log(i + 1);
  }

  console.timeEnd("Время работы");
}