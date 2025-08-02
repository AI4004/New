const os = require('os');
const startTime = new Date();
let intervalId;

module.exports = {
'config': {
'name': "upt",
'version': "1.0.0",
'hasPermssion': 0x0,
'credits': "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
'description': "test",
'commandCategory': "box",
'usages': "test",
'prefix': "false",
'dependencies': {},
'cooldowns': 0x5
},
'run': async function ({
api: _0x1b9028,
event: _0x2e0c98,
args: _0x2d58a4
}) {
const sendUptimeInfo = async () => {
try {
const _0x2e1f77 = (new Date() - startTime) / 1000;
const _0x483168 = Math.floor(_0x2e1f77 / 86400);
const _0x580cd4 = Math.floor(_0x2e1f77 % 86400 / 3600);
const _0x1be39a = Math.floor(_0x2e1f77 % 3600 / 60);
const _0x5c4d32 = Math.floor(_0x2e1f77 % 60);
const _0x109cd3 = _0x483168 + "d " + _0x580cd4 + "h " + _0x1be39a + "m " + _0x5c4d32 + 's';

const _0x23af44 = "♡ ∩_∩\n （„• ֊ •„)♡\n╭──∪∪───────⟡\n│𝗨𝗣𝗧𝗜𝗠𝗘 𝗜𝗡𝗙𝗢\n├───────────⟡\n│ ⏰ 𝗥𝗨𝗡𝗧𝗜𝗠𝗘\n│ " + _0x109cd3 + "\n├───────────⟡";

await _0x1b9028.sendMessage({ 'body': _0x23af44 }, _0x2e0c98.threadID);
} catch (error) {
console.error("Error retrieving system information:", error);
}
};

// Send the initial uptime info
await sendUptimeInfo();

// Set an interval to send uptime info every 5 minutes (300000 ms)
intervalId = setInterval(sendUptimeInfo, 300000);
},
'stop': function() {
// Clear the interval when needed
if (intervalId) {
clearInterval(intervalId);
intervalId = null;
}
}
};
