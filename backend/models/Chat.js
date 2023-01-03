const connection = require("../config/db");

class Chat {
  constructor(body) {
    this.isGroupChat = body.isGroupChat;
    this.chatName = body.chatName;
    this.users = body.users;
    this.groupAdminId = body.groupAdminId;
    this.latestMessageId = body.latestMessageId;
  }

  async save() {
    if (this.groupAdminId === undefined) {
      let sql =
        "INSERT INTO `chats` (chatName,isGroupChat,users) VALUES(?,?,?)";

      return connection.execute(sql, [
        this.chatName,
        this.isGroupChat,
        this.users,
      ]);
    }
    let sql =
      "INSERT INTO `chats` (chatName,isGroupChat,users,groupAdminId)  VALUES(?,?,?,?)";

    return connection.execute(sql, [
      this.chatName,
      this.isGroupChat,
      this.users,
      this.groupAdminId,
    ]);
  }

  static find(user_id, user_id2) {
    let sql =
      "SELECT * FROM `chats` WHERE `users` LIKE '%" +
      user_id +
      "%' AND `users` LIKE '%" +
      user_id2 +
      "%' AND isGroupChat=0";
    return connection.query(sql);
  }

  static findBelongedChats(user_id) {
    let sql = "SELECT * FROM `chats` WHERE `users` LIKE '%" + user_id + "%'";
    return connection.query(sql);
  }

  static findById(id) {
    let sql = "SELECT * FROM `chats` WHERE `id`=?";
    return connection.query(sql, [id]);
  }

  static renameChat(chatId, newName) {
    let sql =
      "UPDATE `chats` SET `chatName`=? WHERE `id`=? AND `isGroupChat`=1";
    return connection.query(sql, [newName, chatId]);
  }

  static updateUsers(chatId, users) {
    let sql = "UPDATE `chats` SET `users`=? WHERE `id`=? AND `isGroupChat`=1";
    return connection.query(sql, [users, chatId]);
  }
}

module.exports = Chat;
