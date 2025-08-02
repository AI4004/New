module.exports.config = {
  name: "un",
  version: "1.0.3",
  hasPermission: 0,
  credits: "CYBER ☢️_𖣘 -BOT ⚠️ TEAM_ ☢️ & Reworked by Gemini",
  description: "Unsend bot messages with a reaction or a reply.",
  commandCategory: "system",
  usages: "",
  cooldowns: 0
};

module.exports.languages = {
  "vi": {
    "returnCant": "Không thể gỡ tin nhắn của người khác.",
    "missingReply": "Hãy reply tin nhắn cần gỡ."
  },
  "en": {
    "returnCant": "",
    "missingReply": "Please reply to the message you want to unsend."
  }
};

module.exports.run = function ({ api, event }) {
  // A simple message to explain the functionality if the command is used directly.
  return api.sendMessage("Reply to a bot message or react with 😡 to unsend it.", event.threadID, event.messageID);
};

module.exports.handleEvent = async function ({ api, event, getText }) {
  const botID = api.getCurrentUserID();

  // Handle reaction to a message
  if (event.type === "message_reaction") {
    const { reaction, messageID } = event;

    // Check if the reaction is 😡
    if (reaction === "😡") {
      try {
        const messageInfo = await api.getMessageInfo(messageID);
        // Check if the reacted message was sent by the bot itself
        if (messageInfo.senderID === botID) {
          await api.unsendMessage(messageID);
        }
      } catch (e) {
        console.error("❌ Failed to unsend message via reaction:", e.message);
      }
    }
  }

  // Handle reply to a bot message
  if (event.type === "message_reply") {
    const { messageReply, threadID, messageID, senderID } = event;

    // Only proceed if the reply is to a message sent by the bot
    if (messageReply.senderID === botID) {
      const triggers = ["/unsend", "unsend", "unsent", "/uns", "😡"];
      const replyBody = event.body.toLowerCase().trim();

      if (triggers.includes(replyBody)) {
        try {
          await api.unsendMessage(messageReply.messageID);
        } catch (e) {
          console.error("❌ Failed to unsend message via reply:", e.message);
        }
      }
    } else {
      // Send an error message if the user tries to unsend someone else's message
      if (senderID !== botID) {
        return api.sendMessage(getText("returnCant"), threadID, messageID);
      }
    }
  }
};
