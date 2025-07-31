const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "hack",
    version: "1.0",
    author: "Mostakim",
    countDown: 5,
    role: 1, // Changed to 0 for general user access, adjust if needed
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
    aliases: ["hacker"],
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

  onStart: async function ({ api, event, args, usersData, threadsData }) {
    let pathImg = __dirname + "/cache/background.png";
    let pathAvt1 = __dirname + "/cache/Avtmot.png";

    const mention = Object.keys(event.mentions);
    let id = mention[0] || event.senderID;

    try {
      let userInfo = await api.getUserInfo(id);
      let name = userInfo[id].name;

      // You can keep a fixed background or use the random one as you had
      var background = ["https://drive.google.com/uc?id=1RwJnJTzUmwOmP3N_mZzxtp63wbvt9bLZ"];
      var rd = background[Math.floor(Math.random() * background.length)];

      let getAvtmot = (
        await axios.get(`https://graph.facebook.com/${id}/picture?width=720&height=720`, {
          responseType: "arraybuffer",
        })
      ).data;
      fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

      let getbackground = (
        await axios.get(`${rd}`, { responseType: "arraybuffer" })
      ).data;
      fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

      let baseImage = await loadImage(pathImg);
      let baseAvt1 = await loadImage(pathAvt1);

      let canvas = createCanvas(baseImage.width, baseImage.height);
      let ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      ctx.font = "400 23px Arial";
      ctx.fillStyle = "#1878F3"; // Facebook blue-like color
      ctx.textAlign = "start";

      const lines = await this.wrapText(ctx, name, 1160);
      ctx.fillText(lines.join("\n"), 200, 497); // Adjust coordinates as needed for your image

      ctx.beginPath();
      ctx.drawImage(baseAvt1, 83, 437, 100, 101); // Adjust coordinates and size for the avatar

      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);

      api.sendMessage(
        {
          body: "✅ 𝙎𝙪𝙘𝙘𝙚𝙨𝙨𝙛𝙪𝙡𝙡𝙮 𝙃𝙖𝙘𝙠𝙚𝙙 𝙏𝙝𝙞𝙨 𝙐𝙨𝙚𝙧! My Lord, Please Check Your Inbox.",
          attachment: fs.createReadStream(pathImg),
        },
        event.threadID,
        () => {
          fs.unlinkSync(pathImg);
          fs.removeSync(pathAvt1); // Ensure avatar is also removed
        },
        event.messageID
      );
    } catch (e) {
      console.error("Error in hack command:", e);
      api.sendMessage("An error occurred while trying to hack. Please try again later.", event.threadID, event.messageID);
      // Clean up files even if an error occurs
      if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
      if (fs.existsSync(pathAvt1)) fs.removeSync(pathAvt1);
    }
  },
};
