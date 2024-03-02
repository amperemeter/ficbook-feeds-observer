const proto = {
  id: '',
  name: '',
  url: '',
  oldArticleCount: 0,
  articleCount: 0,
  setArticleCount(count) {
    this.articleCount = count;
  },
  isNew() {
    return this.articleCount - this.oldArticleCount;
  },
  checkNew() {
    const difference = this.isNew();

    if (difference > 0) {
      console.log(`${this.name}\n${this.url}\nновых ${difference}\n`);
    } else if (difference < 0) {
      console.log(`${this.name}\nудалено ${difference}\n`);
    }

    // if (difference === 0) {
    //   console.log('нет новых'); // для проверки
    // }
  },
  saveCount: async function(func) {
      await func(this);
  }
};

module.exports = proto;