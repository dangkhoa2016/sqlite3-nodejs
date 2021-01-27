
const DbHelper = require('./db_helper');
const db = new DbHelper('database.sqlite3');
const table_name = 'user';


var AsyncLock = require('async-lock');
var locker = new AsyncLock();
const key = 'user-process';



async function set_up(clear_data, seed) {
  await db.execute(`
  CREATE TABLE IF NOT EXISTS user (email TEXT UNIQUE, username TEXT, point INTEGER);
  `
  );

  //clear data
  if (clear_data) {
    console.log(`Delete all ${table_name}`);

    await db.execute(`delete from ${table_name} where rowid > ?`, 0);
  }

  //seed
  if (seed) {
    console.log(`Create 2 ${table_name}`);

    await create_user({ email: 'email_1@test.local', username: 'user_1', point: 1 })
    await create_user({ email: 'email_2@test.local', username: 'user_2', point: 2 })
  }
}

function present(arr) {
  if (!arr)
    return false;

  if (Array.isArray(arr))
    return arr.length > 0;
  else if (typeof arr === 'object' && Object.keys(arr).length > 0)
    return true;
  return false;
}

async function email_exist(email) {
  if (!email)
    return false;

  arr = await db.detail('email', table_name, 'email = ?', email);
  return present(arr);
}

async function create_user(user) {
  if (!user || !user['email'])
    return;

  console.log(`[${new Date()}] Start create ${table_name}`, user);

  await sleep(1);

  if (await email_exist(user['email'])) {
    console.log(`Email ${user['email']} already existed.`)
    return;
  }

  //test sleep
  await sleep(Math.floor(Math.random() * 4));

  try {
    u_id = await db.create(table_name, '?, ?, ?', [user['email'], user['username'], user['point']])
    console.log(`Created id ${u_id}`);
    return u_id;
  }
  catch (ex) {
    console.log('Error: ' + ex.message);
  }
}

function create_user_with_lock(user) {
  return new Promise((resolve) => {
    locker.acquire(key, function (done) {
      // async work
      create_user(user).then(u_id => done(u_id));
    }, function (ret) {
      // lock released
      // console.log('Locker released', ret);
      resolve(ret);
    }, {});
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms * 1000));
}

module.exports = {
  email_exist,
  create_user, create_user_with_lock,
  sleep, set_up, database: db
};
