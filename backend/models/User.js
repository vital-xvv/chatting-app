const connection = require("../config/db");
const colors = require("colors");
const { encodePassword } = require("../config/encodePassword");

class User {
  constructor(body) {
    this.name = body.name;
    this.email = body.email;
    this.picture = body.picture;
    this.password = body.password;
  }

  async save() {
    const encodedPassword = await encodePassword(this.password);
    if (this.picture === undefined) {
      let sql = "INSERT INTO `users` (name,email,password) VALUES(?,?,?)";

      return connection.execute(sql, [this.name, this.email, encodedPassword]);
    }
    let sql =
      "INSERT INTO `users` (name,email,picture,password) VALUES(?,?,?,?)";

    return connection.execute(sql, [
      this.name,
      this.email,
      this.picture,
      encodedPassword,
    ]);
  }

  static findAll() {
    let sql = "SELECT * FROM users;";
    return connection.query(sql);
  }

  static findById(id) {
    let sql = "SELECT * FROM `users` WHERE `id` = ?`";
    return connection.query(sql, [id]);
  }

  static findByEmail(email) {
    let sql = "SELECT * FROM `users` WHERE `email` = ?";
    return connection.query(sql, [email]);
  }
}

module.exports = User;
