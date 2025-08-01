module.exports.config = {
  name: "reactionHandler",
  version: "1.0.1",
  hasPermission: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "Handles message reactions and replies",
  commandCategory: "system",
  usages: "reactionHandler",
  cooldowns: 0
};

module.exports.languages = {
  "vi": {
    "returnCant": "Không thể gỡ tin nhắn của người khác.",
    "missingReply": "Hãy reply tin nhắn cần gỡ."
  },
  "en": {
    "returnCant": "Cannot unsend messages from others.",
    "missingReply": "Please reply to the message you want to unsend."
  }
};

module.exports.run = async function ({ api, event, getText }) {
  const currentUserID = api.getCurrentUserID();

  // Handle reaction event
  if (event.reaction && event.senderID != currentUserID) {
    if (event.reaction === "😡") {
      try {
        await api.unsendMessage(event.messageID);
      } catch (e) {
        console.log("Failed to unsend message:", e);
      }
    }
    return;
  }

  // Handle reply to message
  if (event.messageReply) {
    if (event.messageReply.senderID == currentUserID) {
      try {
        await api.unsendMessage(event.messageReply.messageID);
      } catch (e) {
        console.log("Failed to unsend replied message:", e);
      }
    } else {
      return api.sendMessage(getText("returnCant"), event.threadID);
    }
  }
};
