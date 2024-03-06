module.exports.proto = {
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
    const diff = this.isNew();

    if (diff > 0) {
      console.log(`${this.name}\n${this.url}\nновых ${diff}\n`);
    } else if (diff < 0) {
      console.log(`${this.name}\nудалено ${diff}\n`);
    } else {
      // console.log('нет новых'); // для проверки
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