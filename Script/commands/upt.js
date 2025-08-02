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
} catch (err) {
console.log("[UPTIME] ❌ Ping failed, কিন্তু admin notify করা হবে না");
}
}, 1000 * 60 * 5); // ৫ মিনিট পর পর ping
}

// Error handling to auto-restart the bot on crashes
process.on('uncaughtException', (err) => {
console.error(`[ERROR] Uncaught Exception: ${err.message}`);
// Here you could include logic to restart the bot or log the error
});

process.on('unhandledRejection', (reason, promise) => {
console.error(`[ERROR] Unhandled Rejection at: ${promise}, reason: ${reason}`);
// Here you could include logic to restart the bot or log the error
});

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
