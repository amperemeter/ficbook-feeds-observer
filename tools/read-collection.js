const { scrape } = require("./scrape");
const { proto } = require("./proto");

module.exports.readCollection = async (fanfics, options, props) => {
  console.log(`Всего фэндомов: ${fanfics.length}\n`);
  console.time("Время работы");

  const fanficsCopied = [],
    emptyFandoms = [];

  fanfics.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));

  for (let i = 0; i < fanfics.length; i++) {
    const fanfic = Object.assign({}, proto);
    fanfic.id = fanfics[i]._id;
    fanfic.name = fanfics[i].name;
    fanfic.url = fanfics[i].url;
    fanfic.oldArticleCount = fanfics[i].count;
    fanfic.oldLastArticleName = fanfics[i].article;
    fanficsCopied.push(fanfic);
  }

  for (let i = 0; i < fanficsCopied.length; i++) {
    const res = await scrape(fanficsCopied[i], options, props);

    if (res) {
      emptyFandoms.push(res);
    }
  }

  if (emptyFandoms.length) {
    console.log(`Нет работ: ${emptyFandoms.length}\n`);

    // const obj = {};
    // emptyFandoms.forEach((item) => (obj[item[0]] = item[1]));
    // console.log(obj);
    // console.log("\n");
  }

  console.timeEnd("Время работы");
};
