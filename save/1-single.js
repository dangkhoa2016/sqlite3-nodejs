const helper = require('../helper');

class Single {
  constructor(arr) {
    this.arr = arr;
  }

  async start() {
    if (!this.arr || this.arr.length === 0)
      return;

    for (let item of this.arr) {
      await helper.create_user(item);
    }
  }
}

module.exports = async function (arr) {

  if (!arr || arr.length === 0)
    return;

  await new Single(arr).start();
}
