const os = require('os');
const startTime = new Date();
let intervalId;
let uptimeEnabled = false; // ফ্ল্যাগ যুক্ত করা

module.exports = {
'config': {
'name': "upt",
'version': "1.0.0",
'hasPermission': 0x0,
'credits': "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
'description': "Displays uptime information.",
'commandCategory': "box",
'usages': "upt",
'prefix': "false",
'dependencies': {},
'cooldowns': 0x5
},
'run': async function ({
api: _0x1b9028,
event: _0x2e0c98,
args: _0x2d58a4
}) {
// ফাংশন যা আপটাইম তথ্য পাঠাবে
const sendUptimeInfo = async () => {
try {
const elapsedSeconds = (new Date() - startTime) / 1000;
const days = Math.floor(elapsedSeconds / 86400);
const hours = Math.floor(elapsedSeconds % 86400 / 3600);
const minutes = Math.floor(elapsedSeconds % 3600 / 60);
const seconds = Math.floor(elapsedSeconds % 60);
const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

const message = `♡  ∩_∩\n （„• ֊ •„)♡\n╭──∪∪───────⟡\n│𝗨𝗣𝗧𝗜𝗠𝗘 𝗜𝗡𝗙𝗢\n├───────────⟡\n│ ⏰ 𝗥𝗨𝗡𝗧𝗜𝗠𝗘\n│ ${uptimeString}\n├───────────⟡`;

await _0x1b9028.sendMessage({ 'body': message }, _0x2e0c98.threadID);
} catch (error) {
console.error("Error retrieving system information:", error);
}
};

// যদি Uptime আবেদন সক্রিয় থাকে তাহলে তথ্য পাঠান
if (!uptimeEnabled) {
uptimeEnabled = true;
await sendUptimeInfo(); // প্রথমবার তথ্য পাঠান

// প্রতি ৫ মিনিট পর পর তথ্য পাঠানোর জন্য একটি সময়সীমা
intervalId = setInterval(sendUptimeInfo, 300000);
} else {
await _0x1b9028.sendMessage({ 'body': "Uptime information is already enabled. Use the command again to refresh." }, _0x2e0c98.threadID);
}
},
'stop': function() {
// যখন প্রয়োজন তখন সময়সীমা পরিষ্কার করুন
if (intervalId) {
clearInterval(intervalId);
intervalId = null;
uptimeEnabled = false; // Uptime পুনরায় নিষ্ক্রিয় করুন
}
}
};
