
const sqlite3 = require('sqlite3').verbose();

class DbHelper {

  constructor(dbname) {
    this.db = new sqlite3.Database(dbname, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the file SQlite database.');
    });
  }

  execute(sql, values) {
    var t = this;
    return new Promise((resolve, reject) => {
      t.db.run(sql, values, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  }

  query(sql, values) {
    var t = this;
    return new Promise((resolve, reject) => {
      t.db.all(sql, values, (err, rows) => {
        if (err) return reject(err);
        return resolve(rows);
      });
    });
  }

  detail(select_fields, table, where_conditions, values) {
    var t = this;
    return new Promise((resolve, reject) => {
      t.db.get(`select ${select_fields} from ${table} where ${where_conditions}`, values, (err, row) => {
        if (err) return reject(err);
        return resolve(row);
      });
    });
  }

  create(table_with_columns, columns, values) {
    var t = this;
    return new Promise((resolve, reject) => {
      t.db.run(`insert into ${table_with_columns} values (${columns})`, values, function (err) {
        if (err) return reject(err);
        return resolve(this.lastID);
      });
    });
  }

  delete(table, where_conditions, values) {
    var t = this;
    return new Promise((resolve, reject) => {
      t.db.run(`delete from ${table} where ${where_conditions}`, values, function (err) {
        if (err) return reject(err);
        return resolve(true);
      });
    });
  }

  update(table, set_conditions, where_conditions, values) {
    var t = this;
    return new Promise((resolve, reject) => {
      t.db.run(`update ${table} set ${set_conditions} where ${where_conditions}`, values, (err) => {
        if (err) return reject(err);
        return resolve(true);
      });
    });
  }

}


module.exports = DbHelper;