const db = require("../config/db");

class User {
  constructor(body) {
    this.id = body.id;
    this.name = body.name;
    this.email = body.email;
    this.picture = body.picture;
    this.password = body.password;
    this.timestamp = body.timesatmp;
  }

  save() {
    let sql = `INSERT INTO users(
            name,
            email,
            picture,
            password) 
        VALUES(
        ${this.name},
        ${this.email},
        ${this.picture},
        ${this.password} 
        );`;

    return db.execute(sql);
  }

  static findAll() {
    let sql = "SELECT * FROM users;";
    return db.execute(sql);
  }

  static findById(id) {
    let sql = `SELECT * FROM users WHERE id = ${id};`;
    return db.execute(sql);
  }
}

module.exports = User;
