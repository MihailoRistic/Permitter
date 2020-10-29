const Discord = require("discord.js");

const client = new Discord.Client();

const prefix = "p!";

let binds = new Map();

client.once("ready", () => {
  console.log("Online!");
});

client.on("message", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content
    .slice(prefix.lenght)
    .split(prefix)[1]
    .split(/ +/);
  if (args[0] === "bind") {
    let vc = message.guild.channels.resolve(args[1]);
    if (vc == null) {
      message.channel.send("VC::Pogresno ukucano ili ne postoji :(");
    } else if (vc.type === "voice") {
      let tc = message.guild.channels.resolve(args[2]);
      if (tc == null) {
        message.channel.send("TC::Pogresno ukucano ili ne postoji :(");
      } else if (tc.type === "text") {
        message.channel.send("Uspesno spojen " + tc.name + " sa " + vc.name);
        binds.set(vc, tc);
      } else message.channel.send("TC::nije dat tc :(");
    } else message.channel.send("VC::nije dat vc :(");
  }
});

client.on("voiceStateUpdate", (oldState, newState) => {
  const user = newState.member;
  let channel = null;
  let see = null;
  let write = null;
  if (newState.channel == null) {
    console.log("Izasao si iz vc");
    channel = binds.get(oldState.channel);
    see = false;
  } else {
    console.log("Usao si u vc");
    channel = binds.get(newState.channel);
    see = true;
  }
  if (newState.mute) {
    console.log("Mute se");
    write = true;
  } else {
    console.log("Unmute se");
    write = false;
  }

  channel.updateOverwrite(user, {
    VIEW_CHANNEL: see,
    SEND_MESSAGES: write
  });
});

client.login(process.env.TOKEN);
