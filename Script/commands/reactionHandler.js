module.exports = function ({ api, models, Users, Threads, Currencies }) {
  return async function ({ event }) {
    const { threadID, messageID, userID, reaction } = event;

    // ধরা যাক তোমার admin ID গুলো নিচের array তে রাখো
    const adminIDs = ['61577565253243', '61570292561520']; // এখানে তোমার admin id গুলো রাখো

    // যদি reaction না হয় বা reaction বাদে অন্য event হয় তাহলে বাতিল
    if (!reaction) return;

    // যদি রিয়্যাকশন দেয়ার ইউজার admin না হয়, তাহলে বাতিল
    if (!adminIDs.includes(userID)) return;

    // শুধু 😡 reaction এর জন্য কাজ করবো
    if (reaction !== '😡') return;

    try {
      // মেসেজ ইনফো নিয়ে আসি
      const msgInfo = await api.getMessageInfo(messageID);

      // মেসেজ কার - senderID
      const senderID = msgInfo.senderID;

      // bot id দিয়ে চেক করো, ধরলাম তোমার bot id এইটা
      const botID = api.getCurrentUserID();

      if (senderID === botID) {
        // মেসেজ unsend করো (মুছে ফেলো)
        await api.unsendMessage(messageID);

        // চাইলে thread এ একটা নোটিফিকেশন পাঠাও
        return api.sendMessage(`😡 Admin ${userID} reacted with angry emoji, so message deleted.`, threadID);
      }
    } catch (error) {
      console.error('handleReaction error:', error);
    }
  };
};
