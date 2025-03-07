const needle = require("needle");
const cheerio = require("cheerio");
const { askCheck, askDelete, timeout } = require("./utils");

module.exports.scrape = async (fanficContext, options, props) => {    
  let hotArticles = 0,
    link = fanficContext.url,
    noFic = "";

  const getLastPage = async () => {
    try {
      const res = await needle("get", `${link}?p=1`, options);

      const $ = cheerio.load(res.body);
      await timeout(1000);

      const lastPage =
        Number($(".pagination a:nth-last-child(2)").html()) || 1;

      // проверить наличие блока с "горячими работами"
      const blockSeparator = $(".block-separator");

      if (blockSeparator.length) {
        hotArticles = blockSeparator
          .parent("section")
          .children("article").length;
      }
      
      return lastPage;
    } catch (err) {
      console.error(`${err.message}\n`);
    }
  };

  const getArticles = async (lastPage) => {
    try {
      const res = await needle("get", `${link}?p=${lastPage}`, options);

      const $ = cheerio.load(res.body);
      await timeout(1000);

      // вычислить количество фанфиков
      const articlesOnLastPage = $(".fanfic-inline").length;
      let articles = (lastPage - 1) * 20 + articlesOnLastPage;

      if (lastPage === 1) {
        articles = articles - hotArticles;
      }

      if (articles === 2000) {
        const lastArticleName = $(".fanfic-inline-title a")
          .last()
          .text()
          .trim();

        if (fanficContext.oldLastArticleName !== lastArticleName) {
          if (fanficContext.oldLastArticleName) {
            console.log(
              `${fanficContext.name}\n${fanficContext.url}\nесть изменения\n`,
            );
          }

          fanficContext.setLastArticleName(lastArticleName);
        }
      }

      // если нет фанфиков, но до этого они были,
      // спрашиваем об изменении количества фанфиков в бд
      if (!articles && fanficContext.oldArticleCount ||  fanficContext.oldArticleCount - articles > 20) {
        await askCheck(fanficContext);
        const answer = await askDelete();

        if (answer === "н") {
          articles = fanficContext.oldArticleCount;
        }
      }

      if (!articles || !$(".content-section").length) {
        noFic = [fanficContext.name, fanficContext.url];
      }

      return articles;
    } catch (err) {
      console.error(`${err.message}\n`);
    }
  };

  const saveData = async () => {
    return await getLastPage()
      .then((lastPage) => {
        return getArticles(lastPage);
      })
      .then(async (articles) => {
        fanficContext.setArticleCount(articles); // установить значение в свойство articleCount
        fanficContext.checkNew(); // проверить разницу между oldArticleCount и articleCount
        await fanficContext.saveLocalData(props.changedFanfics); // сохранить данные
        await fanficContext.saveDataBase(props.collection); // сохранить кол-во новых работ
        return true;   
      })
      .catch((err) => {
        console.error(`${err.message}\n`);
      });
  };

  const res = await saveData();
  setTimeout(() => !res && console.error(fanficContext.name, "\nОжидание больше 10 секунд\n"), 10000);

  return noFic;
};