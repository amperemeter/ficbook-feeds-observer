const Proto = {
  id: '',
  name: '',
  url: '',
  oldArticleCount: 0,
  articleCount: 0,
  difference: 0,
  setArticleCount(count) {
    this.articleCount = count;
  },
  checkNew() {
    this.difference = this.articleCount - this.oldArticleCount;

    if (this.difference > 0) {
      console.log(`${this.name}\nновых ${this.difference}\n${this.url}\n`);
    } else if (this.difference < 0) {
      console.log(`${this.name}\nудалено ${this.difference}\n`);
    }
  },
  saveCount: async function(func) {
      await func(this);
  }
};

module.exports = Proto;