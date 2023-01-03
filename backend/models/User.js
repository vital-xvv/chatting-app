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

  static async populateUsersWithoutPassword(userIds) {
    let populate_users = new Array();
    for (let i = 0; i < userIds.length; i++) {
      let [user] = await User.findById(userIds[i]);
      let userObject = {
        _id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        picture: user[0].picture,
        timestamp: user[0].timestamp,
      };
      populate_users.push(userObject);
    }
    return populate_users;
  }

  static async populateUserWithoutPassword(userId) {
    if (userId === undefined || userId === null) return;
    let [user] = await User.findById(userId);
    let userObject = {
      _id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      picture: user[0].picture,
      timestamp: user[0].timestamp,
    };

    return userObject;
  }

  static findAll() {
    let sql = "SELECT * FROM users;";
    return connection.query(sql);
  }

  static findById(id) {
    let sql = "SELECT * FROM `users` WHERE `id` = ?";
    return connection.query(sql, [id]);
  }

  static findByEmail(email) {
    let sql = "SELECT * FROM `users` WHERE `email` = ?";
    return connection.query(sql, [email]);
  }

  static find(search) {
    let sql =
      "SELECT * FROM `users` WHERE `email` LIKE '%" +
      search +
      "%' OR `name` LIKE '%" +
      search +
      "%'";
    return connection.query(sql);
  }
}

module.exports = User;
