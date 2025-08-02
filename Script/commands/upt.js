const axios = require("axios");
const moment = require("moment");

module.exports.config = {
  name: "uptime",
  version: "1.2",
  author: "Kawsar",
  cooldowns: 3,
  description: "Shows bot uptime & auto-pings render host",
  commandCategory: "system",
  usages: "{pn}"
};

let hostURL = null;

async function startAutoPing(api) {
  // শুধু RENDER_EXTERNAL_URL ইউজ করবো
  hostURL = process.env.RENDER_EXTERNAL_URL || null;

  if (!hostURL) {
    console.log("[UPTIME] ❌ Render host URL not detected, auto-ping disabled.");
    return;
  }

  if (!hostURL.startsWith("http")) hostURL = "https://" + hostURL;
  if (!hostURL.endsWith("/uptime")) hostURL += "/uptime";

  console.log(`[UPTIME] ✅ Auto ping started: ${hostURL}`);

  setInterval(async () => {
    try {
      await axios.get(hostURL, { timeout: 10000 });
      // ping সফল হলে কিছু করবে না
    } catch (err) {
      console.log("[UPTIME] ❌ Ping failed, কিন্তু admin notify করা হবে না");
      // এখানে আর admin মেসেজ নেই, তাই silent fail
    }
  }, 1000 * 60 * 5); // ৫ মিনিট পর পর ping
}

module.exports.run = async function({ api, event, args }) {
  if (!hostURL) await startAutoPing(api);

  const uptime = Math.floor(process.uptime());
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;

  let uptimeFormatted = `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s`;
  if (days === 0) uptimeFormatted = `⏳ ${hours}h ${minutes}m ${seconds}s`;
  if (hours === 0) uptimeFormatted = `⏳ ${minutes}m ${seconds}s`;
  if (minutes === 0) uptimeFormatted = `⏳ ${seconds}s`;

  return api.sendMessage(`𝗕𝗼𝘁 𝗨𝗽𝘁𝗶𝗺𝗲: ${uptimeFormatted}`, event.threadID);
};
