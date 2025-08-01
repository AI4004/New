module.exports = function ({ api, models, Users, Threads, Currencies }) {
  return async function ({ event }) {
    const { threadID, messageID, userID, reaction } = event;

    const adminIDs = ["61570292561520"];

    if (!reaction) return;
    if (!adminIDs.includes(userID)) return;
    if (reaction !== '😡') return;

    try {
      const msgInfo = await api.getMessageInfo(messageID);
      const senderID = msgInfo.senderID;
      const botID = api.getCurrentUserID();

      if (senderID === botID) {
        await api.unsendMessage(messageID);
        // sms pathano bad dilam
      }
    } catch (error) {
      console.error('handleReaction error:', error);
    }
  };
};
