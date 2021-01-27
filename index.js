
const helper = require('./helper');

(async () => {
  await helper.set_up(true, false);

  require('./test-save/start');
})();

