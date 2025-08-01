const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
config: {
name: "hack",
version: "1.0",
author: "Mostakim",
countDown: 5,
role: 1, // সাধারণ ব্যবহারকারী অ্যাক্সেসের জন্য 0 এ পরিবর্তন করুন, প্রয়োজনে সামঞ্জস্য করুন
category: "fun",
shortDescription: {
en: "Generates a 'hacking' image with the user's profile picture.",
},
longDescription: {
en: "Generates a 'hacking' image with the user's profile picture, useful for a fun prank.",
},
usage: {
en: "{p}hack [mention user]",
},
aliases: ["hack"],
},

wrapText: async (ctx, name, maxWidth) => {
return new Promise((resolve) => {
if (ctx.measureText(name).width < maxWidth) return resolve([name]);
if (ctx.measureText("W").width > maxWidth) return resolve(null);
const words = name.split(" ");
const lines = [];
let line = "";
while (words.length > 0) {
let split = false;
while (ctx.measureText(words[0]).width >= maxWidth) {
const temp = words[0];
words[0] = temp.slice(0, -1);
if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
else {
split = true;
words.splice(1, 0, temp.slice(-1));
}
}
if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
line += `${words.shift()} `;
} else {
lines.push(line.trim());
line = "";
}
if (words.length === 0) lines.push(line.trim());
}
return resolve(lines);
});
},

onStart: async function ({ api, event, args }) {
let pathImg = __dirname + "/cache/background.png";
let pathAvt1 = __dirname + "/cache/avtmot.png";

const mention = Object.keys(event.mentions);
let id = mention.length > 0 ? mention[0] : event.senderID;

try {
let userInfo = await api.getUserInfo(id);
let name = userInfo[id].name;

let backgroundURL = "https://drive.google.com/uc?id=1RwJnJTzUmwOmP3N_mZzxtp63wbvt9bLZ"; // মূল ব্যাকগ্রাউন্ড চিত্র URL

// প্রোফাইল পিকচার টানার জন্য Facebook Graph API কল
let getAvatar = await axios.get(`https://graph.facebook.com/${id}/picture?width=720&height=720`, { responseType: "arraybuffer" });
fs.writeFileSync(pathAvt1, Buffer.from(getAvatar.data, "utf-8"));

// ব্যাকগ্রাউন্ড ইমেজের জন্য HTTP কল
let getBackground = await axios.get(backgroundURL, { responseType: "arraybuffer" });
fs.writeFileSync(pathImg, Buffer.from(getBackground.data, "utf-8"));

let baseImage = await loadImage(pathImg);
let baseAvt1 = await loadImage(pathAvt1);

let canvas = createCanvas(baseImage.width, baseImage.height);
let ctx = canvas.getContext("2d");

ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
ctx.font = "400 23px Arial";
ctx.fillStyle = "#1878F3"; // ফরেসবুক নীলের মতো রং
ctx.textAlign = "start";

const lines = await this.wrapText(ctx, name, 1160);
ctx.fillText(lines.join("\n"), 200, 497); // টেক্সটের কি কর্ডিনেট সামঞ্জস্য করুন 

ctx.beginPath();
ctx.drawImage(baseAvt1, 83, 437, 100, 101); // প্রোফাইল পিকচার সামঞ্জস্য করুন 

const imageBuffer = canvas.toBuffer();
fs.writeFileSync(pathImg, imageBuffer);

api.sendMessage(
{
body: "✅ 𝙎𝙪𝙘𝙘𝙚𝙨𝙨𝙛𝙥𝙣𝙦𝙡𝙯𝙘𝙡𝙬𝙭𝙘𝙝𝙎𝙘𝙡𝙕!",
attachment: fs.createReadStream(pathImg),
},
event.threadID,
() => {
fs.unlinkSync(pathImg);
fs.removeSync(pathAvt1); // অ্যাভাটার ফাইল মুছে ফেলুন 
},
event.messageID
);
} catch (e) {
console.error("Error in hack command:", e);
api.sendMessage("একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।", event.threadID, event.messageID);
if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
if (fs.existsSync(pathAvt1)) fs.removeSync(pathAvt1);
}
},
};
