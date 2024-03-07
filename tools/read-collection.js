const {scrape} = require("./scrape");
const {proto} = require('./proto');


module.exports.readCollection = async (fanfics, props) => {
  console.log(`Всего фэндомов: ${fanfics.length}\n`);
  console.time("Время работы");

  const fanficsCopied = [], noPages = [], noFanfics = [];
  fanfics.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);

  for (let i = 0; i < fanfics.length; i++) {
    const fanfic = Object.assign({}, proto);
    fanfic.id = fanfics[i]._id;
    fanfic.name = fanfics[i].name;
    fanfic.url = fanfics[i].url;
    fanfic.oldArticleCount = fanfics[i].count;
    fanficsCopied.push(fanfic);
  }

  for (let i = 0; i < fanficsCopied.length; i++) {
    const res = await scrape(fanficsCopied[i], props);

    if (res) {
      res.noPage ? noPages.push(res.noPage) : noFanfics.push(res.noFic);
    }
  }

  if (noPages.length) {
    console.log(`нет страниц: ${noPages.length}`);
    console.log(noPages);
    console.log('\n');
  }

  if (noFanfics.length) {
    console.log(`нет работ: ${noFanfics.length}`);
    console.log(noFanfics);
    console.log('\n');
  }

  console.timeEnd("Время работы");
}