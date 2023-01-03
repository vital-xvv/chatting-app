const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");
const User = require("../models/User");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param is undefined");
    return res.sendStatus(400);
  }

  let [isChat] = await Chat.find(req.user._id, userId);

  if (isChat.length > 0) {
    let userIds = JSON.parse(isChat[0].users);
    isChat[0].users = await User.populateUsersWithoutPassword(userIds);
    res.status(200);
    res.json(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: JSON.stringify([req.user._id, userId]),
    };

    try {
      const [createdChat] = await new Chat(chatData).save();
      if (createdChat) {
        const [fullChatData] = await Chat.findById(createdChat.insertId);
        let userIds = JSON.parse(fullChatData[0].users);
        fullChatData[0].users = await User.populateUsersWithoutPassword(
          userIds
        );
        res.status(201);
        res.json(fullChatData[0]);
      }
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    const [chats] = await Chat.findBelongedChats(req.user._id);

    if (chats.length > 0) {
      for (let i = 0; i < chats.length; i++) {
        let userIds = JSON.parse(chats[i].users);
        chats[i].users = await User.populateUsersWithoutPassword(userIds);
        chats[i].groupAdminId = await User.populateUserWithoutPassword(
          chats[i].groupAdminId
        );
      }
      res.status(200);
      res.json(chats);
    } else {
      res.status(404);
      res.send("User has no chats");
    }
  } catch (error) {
    res.status(400);
    throw new Error("Error occured while searching the user's chats");
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;
  if (!users || !name) {
    res.status(400);
    res.send({ message: "Name or users of the group are missing." });
    return;
  }

  if (users.length < 2) {
    res.status(400);
    res.send({ message: "A Group Chat must contain more than 2 users" });
    return;
  }

  users.push(req.user._id);

  try {
    const chat_body = {
      isGroupChat: 1,
      chatName: name,
      users: JSON.stringify(users),
      groupAdminId: req.user._id,
    };
    const [groupChat] = await new Chat(chat_body).save();

    const [createdgroupChat] = await Chat.findById(groupChat.insertId);

    let userIds = JSON.parse(createdgroupChat[0].users);
    createdgroupChat[0].users = await User.populateUsersWithoutPassword(
      userIds
    );
    createdgroupChat[0].groupAdminId = await User.populateUserWithoutPassword(
      createdgroupChat[0].groupAdminId
    );
    res.status(200);
    res.json(createdgroupChat[0]);
  } catch (error) {
    res.status(400);
    res.send({
      message: "Failed to create a new group chat",
      error: error.message,
    });
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, newName } = req.body;

  if (!chatId || !newName) {
    res.status(400);
    res.send({ message: "New name or chat id are missing." });
    return;
  }

  try {
    const [chat] = await Chat.findById(chatId);
    if (chat[0].groupAdminId !== req.user._id && chat[0].isGroupChat === 1) {
      res.status(400);
      res.send({ message: "Only Group Admin can rename the Group." });
      return;
    }
    const [renamedChat] = await Chat.renameChat(chatId, newName);
    if (renamedChat) {
      res.status(202);
      const [result] = await Chat.findById(chatId);

      let userIds = JSON.parse(result[0].users);
      result[0].users = await User.populateUsersWithoutPassword(userIds);
      result[0].groupAdminId = await User.populateUserWithoutPassword(
        result[0].groupAdminId
      );
      res.json(result[0]);
    }
  } catch (error) {
    res.status(400);
    res.send({
      message: "Failed to rename the group chat",
      error: error.message,
    });
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    res.status(400);
    res.send({ message: "User id or chat id are missing." });
    return;
  }

  try {
    const [chat] = await Chat.findById(chatId);

    if (chat) {
      var users = JSON.parse(chat[0].users);
      if (
        !users.includes(userId) &&
        chat[0].isGroupChat === 1 &&
        chat[0].groupAdminId === req.user._id
      ) {
        users.push(userId);
        await Chat.updateUsers(chatId, JSON.stringify(users));
      } else {
        res.status(400);
        res.send({
          message: "Only Group Admin can add a new user to the Group",
        });
        return;
      }
    }

    const [updatedChat] = await Chat.findById(chatId);

    updatedChat[0].users = await User.populateUsersWithoutPassword(users);
    updatedChat[0].groupAdminId = await User.populateUserWithoutPassword(
      updatedChat[0].groupAdminId
    );
    res.status(202);
    res.json(updatedChat[0]);
  } catch (error) {
    res.status(400);
    res.send({
      message: "Failed to add user to the group chat",
      error: error.message,
    });
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    res.status(400);
    res.send({ message: "User id or chat id are missing." });
    return;
  }

  try {
    const [chat] = await Chat.findById(chatId);

    if (chat) {
      var users = JSON.parse(chat[0].users);
      if (!users.includes(userId)) {
        res.status(400);
        res.send({
          message: "The User is not the Group Chat participant",
        });
        return;
      } else if (chat[0].isGroupChat !== 1) {
        res.status(400);
        res.send({
          message: "Users can be removed only from Group Chats",
        });
        return;
      } else if (chat[0].groupAdminId !== req.user._id) {
        res.status(400);
        res.send({
          message: "Only Group Admin can add a new user to the Group",
        });
        return;
      } else {
        users = users.filter((u) => u !== userId);
        await Chat.updateUsers(chatId, JSON.stringify(users));
      }

      const [updatedChat] = await Chat.findById(chatId);

      updatedChat[0].users = await User.populateUsersWithoutPassword(users);
      updatedChat[0].groupAdminId = await User.populateUserWithoutPassword(
        updatedChat[0].groupAdminId
      );
      res.status(202);
      res.json(updatedChat[0]);
    }
  } catch (error) {
    res.status(400);
    res.send({
      message: "Failed to remove user from the group chat",
      error: error.message,
    });
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
