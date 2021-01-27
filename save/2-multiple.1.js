const helper = require('../helper');

class Multiple1 {
  constructor(arr) {
    this.arr = arr;
  }

  async start() {
    if (!this.arr || this.arr.length === 0)
      return;

    var promises = [];
    this.arr.map((item) => {
      promises.push(helper.create_user(item));
    });

    await Promise.all(promises);
  }
}

module.exports = async function (arr) {

  if (!arr || arr.length === 0)
    return;

  await new Multiple1(arr).start();
}
