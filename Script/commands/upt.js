const os = require('os');
const startTime = new Date();
let uptimeMessageInterval;

// এখানে এডমিনের ID দিয়ে দিন
const adminId = '61570292561520'; // YOUR_ADMIN_ID এর স্থানে আপনার এডমিন ID প্রদান করুন

module.exports = {
'config': {
'name': "upt",
'version': "1.0.1",
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
// Define uptime calculation function
const calculateUptime = () => {
const _0x2e1f77 = (new Date() - startTime) / 1000;
const _0x483168 = Math.floor(_0x2e1f77 / 86400);
const _0x580cd4 = Math.floor(_0x2e1f77 % 86400 / 3600);
const _0x1be39a = Math.floor(_0x2e1f77 % 3600 / 60);
const _0x5c4d32 = Math.floor(_0x2e1f77 % 60);
return `${_0x483168}d ${_0x580cd4}h ${_0x1be39a}m ${_0x5c4d32}s`;
};

// Function to send uptime message
const sendUptimeMessage = async () => {
const uptime = calculateUptime();
const uptimeMessage = "♡  ∩_∩\n （„• ֊ •„)♡\n╭──∪∪───────⟡\n│𝗨𝗣𝗧𝗜𝗠𝗘 𝗜𝗡𝗙𝗢\n├───────────⟡\n│ ⏰ 𝗥𝗨𝗡𝗧𝗜𝗠𝗘\n│ " + uptime + "\n├───────────⟡";
await _0x1b9028.sendMessage({
'body': uptimeMessage
}, adminId); // Send message only to admin
};

// If uptime interval is already set, clear it to avoid multiple intervals
if (uptimeMessageInterval) {
clearInterval(uptimeMessageInterval);
}

// Send an initial uptime message
await sendUptimeMessage();

// Start a new interval to send uptime messages every 5 minutes
uptimeMessageInterval = setInterval(sendUptimeMessage, 5 * 60 * 1000);

// Handle command to stop the uptime messages if needed
if (_0x2d58a4[0] === "stop") {
clearInterval(uptimeMessageInterval);
uptimeMessageInterval = null;
return _0x1b9028.sendMessage("Uptime messages have been stopped.", adminId); // Send stop message to admin
}
}
};
