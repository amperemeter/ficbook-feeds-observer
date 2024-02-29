const needle = require("needle");
const cheerio = require("cheerio");

const Scrape = async (fanficContext, func) => {
  let page, hotArticles = 0, link = fanficContext.url;

  const options = {
    open_timeout: 60000,
    user_agent: 'MyApp/1.2.3',
    parse_response: false,
  }

  const getLastPage = async () => {
    await needle('get', `${link}?p=1`, options)
      .then(async function (res, err) {
        if (err) throw err;

        const $ = cheerio.load(res.body);

        if (!$(".content-section").length ) {
          throw new Error('Не найдена страница!');
        }

        page = $(".pagenav .paging-description b:last-of-type").html() || '1';

        // проверить наличие блока с "горячими работами"
        if ($(".block-separator").length) {
          hotArticles = $(".block-separator").parent('section').children('article').length;
        }
      })
      .catch(function (err) {
        console.log(`Needle First Page Error!\n${err.message}\n`);
      });
  }

  const getArticles = async () => {
    await needle('get', `${link}?p=${page}`, options)
      .then(async function (res, err) {
        if (err) throw err;
        const $ = cheerio.load(res.body);

        if (!$(".content-section").length ) {
          throw new Error('Не найдена страница!');
        }

        // вычислить количество фанфиков
        let articles = $(".fanfic-inline").length;
        articles = (page - 1) * 20 + articles - hotArticles;

        await fanficContext.setArticleCount(articles); // установить значение в свойство articleCount
        await fanficContext.checkNew(); // проверить разницу между oldArticleCount и articleCount
        await fanficContext.saveCount(func); // сохранить данные
      })
      .catch(function (err) {
        console.log(`Needle Last Page Error!\n${err.message}\n`);
      });
  }

  await getLastPage();
  await getArticles();
}

module.exports = Scrape;