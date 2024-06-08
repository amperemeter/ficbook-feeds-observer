const needle = require("needle");
const cheerio = require("cheerio");
const { askCheck, askDelete } = require("./utils");

module.exports.scrape = async (fanficContext, props) => {
  let hotArticles = 0,
    link = fanficContext.url,
    noFic = "";

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const options = {
    open_timeout: 60000,
    user_agent: "MyApp/1.2.3",
    parse_response: false,
  };

  async function getLastPage() {
    await needle("get", `${link}?p=1`, options)
      .then(async (res) => {
        const $ = cheerio.load(res.body);
        await timeout(1000); // имитируем действия человека

        const page =
          Number($(".pagenav .paging-description b:last-of-type").html()) || 1;

        // проверить наличие блока с "горячими работами"
        const blockSeparator = $(".block-separator");

        if (blockSeparator.length) {
          hotArticles = blockSeparator
            .parent("section")
            .children("article").length;
        }

        return page;
      })
      .then(async (page) => {
        await getArticles(page);
      })
      .catch((err) => {
        console.log(`${err.message}\n`);
      });
  }

  async function getArticles(page) {
    await needle("get", `${link}?p=${page}`, options)
      .then(async (res) => {
        const $ = cheerio.load(res.body);
        await timeout(1000); // имитируем действия человека

        // вычислить количество фанфиков
        const articlesOnLastPage = $(".fanfic-inline").length;
        let articles = (page - 1) * 20 + articlesOnLastPage;

        if (page === 1) {
          articles = articles - hotArticles;
        }

        // если нет фанфиков, но до этого они были,
        // спрашиваем об изменении количества фанфиков в бд
        if (!articles && fanficContext.oldArticleCount) {
          await askCheck(fanficContext);
          const answer = await askDelete();

          if (answer === "н") {
            articles = fanficContext.oldArticleCount;
          }
        }

        if (!articles || !$(".content-section").length) {
          noFic = [fanficContext.name, fanficContext.url];
        }

        await fanficContext.setArticleCount(articles); // установить значение в свойство articleCount
        await fanficContext.checkNew(); // проверить разницу между oldArticleCount и articleCount
        await fanficContext.saveData(props.changedFanfics); // сохранить данные
        await fanficContext.saveCount(props.collection); // сохранить кол-во новых работ
      })
      .catch((err) => {
        console.log(`${err.message}\n`);
      });
  }

  await getLastPage();
  return noFic;
};
