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
  if ((channel = binds.get(oldState.channel)) == null)
    if ((channel = binds.get(newState.channel)) == null) {
    } else
      channel.updateOverwrite(user, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: newState.mute
      });
  else if (binds.get(newState.channel) == null)
    channel.updateOverwrite(user, {
      VIEW_CHANNEL: false,
      SEND_MESSAGES: newState.mute
    });
  else {
    if (channel == binds.get(newState.channel)) {
    } else
      channel.updateOverwrite(user, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: newState.mute
      });
    binds.get(newState.channel).updateOverwrite(user, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: newState.mute
    });
  }
});

client.login(process.env.TOKEN);
