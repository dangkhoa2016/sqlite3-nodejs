const helper = require('../helper');
const async_pool = require('../async_pool');
const max_allow = 3;

class Concurrency1 {
  constructor(arr) {
    this.arr = arr;
  }

  async start() {
    if (!this.arr || this.arr.length === 0)
      return;

    await async_pool(max_allow, this.arr, async (item) => {
      return await helper.create_user(item);
    });
  }
}

module.exports = async function (arr) {

  if (!arr || arr.length === 0)
    return;

  await new Concurrency1(arr).start();
}
