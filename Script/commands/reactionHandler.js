module.exports.config = {
name: "reactionHandler",
version: "1.0.0",
hasPermission: 0,
credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
description: "Handles message reactions",
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
}

module.exports.run = function({ api, event, getText }) {
// Check if the event is a reaction
if (event.type == "message_reaction") {
const currentUserID = api.getCurrentUserID();

// Only proceed if the reaction is from someone else
if (event.senderID != currentUserID) {
// If the reaction is a specific emoji (e.g., 😡)
if (event.reaction === "😡") {
// Check if the messageID exists to unsend the message
if (event.messageID) {
return api.unsendMessage(event.messageID);
}
}
}
}

// Check if it's a message reply
if (event.type == "message_reply") {
// Make sure the replied message is from the bot
if (event.messageReply.senderID == api.getCurrentUserID()) {
return api.unsendMessage(event.messageReply.messageID);
} else {
return api.sendMessage(getText("returnCant"), event.threadID, event.messageID);
}
} else {
return api.sendMessage(getText("missingReply"), event.threadID, event.messageID);
}
}
