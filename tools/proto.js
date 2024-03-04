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
    } else {
      console.log('нет новых');
    }
  },
  async saveData(changedFanfics) {
    if (!changedFanfics) return;

    changedFanfics.push({
        "name": this.name,
        "url": this.url,
        "count": this.articleCount
      });
  },
  async saveCount(collection) {
    try {
      if (!collection) return;

      if (this.isNew()) {
        await collection.updateOne({url: this.url}, {$set: {count: this.articleCount}});
      }
    } catch (err) {
      throw new Error(err);
    }
  }
};

module.exports = proto;