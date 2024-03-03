const needle = require("needle");
const cheerio = require("cheerio");


const timeout = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const scrape = async (fanficContext, props) => {
  let hotArticles = 0, link = fanficContext.url;

  const options = {
    open_timeout: 60000,
    user_agent: 'MyApp/1.2.3',
    parse_response: false,
  }

  async function getLastPage() {
    await needle('get', `${link}?p=1`, options)
      .then(async function (res) {
        const $ = cheerio.load(res.body);

        if (!$(".content-section").length) {
          throw new Error(`${fanficContext.name}\nнет страницы фэндома`);
        }

        const page = $(".pagenav .paging-description b:last-of-type").html() || '1';

        // проверить наличие блока с "горячими работами"
        const blockSeparator = $(".block-separator");

        if (blockSeparator.length) {
          hotArticles = blockSeparator.parent('section').children('article').length;
        }

        await timeout(700); // имитируем действия человека
        return page;
      })
      .then(async function (page) {
        await getArticles(page);
        await timeout(700);
      })
      .catch(function (err) {
        console.log(`${err.message}\n`);
      });
  }

  async function getArticles(page) {
    await needle('get', `${link}?p=${page}`, options)
      .then(async function (res, err) {
        if (err) throw err;

        const $ = cheerio.load(res.body);

        // вычислить количество фанфиков
        const articlesOnLastPage = $(".fanfic-inline").length;
        const articles = (page - 1) * 20 + articlesOnLastPage - hotArticles;

        await fanficContext.setArticleCount(articles); // установить значение в свойство articleCount
        await fanficContext.checkNew(); // проверить разницу между oldArticleCount и articleCount
        await fanficContext.saveData(props.changedFanfics); // сохранить данные
        await fanficContext.saveCount(props.collection); // сохранить кол-во новых работ
      })
      .catch(function (err) {
        console.log(`${err.message}\n`);
      });
  }

  await getLastPage();
}

module.exports = scrape;