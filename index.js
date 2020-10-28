const Discord = require("discord.js");

const client = new Discord.Client();

const prefix = "p!";

let Ourrole = null;

client.once("ready", () => {
  console.log("Online!");
});

client.on("message", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content
    .slice(prefix.lenght)
    .split(prefix)[1]
    .split(/ +/);
  if (args[0] === "setrole") {
    roleID = message.guild.roles
      .fetch(args[1])
      .then(role => {
        if (role == null) {
          message.channel.send("Pogresno ukucano ili ne postoji :(");
        } else {
          message.channel.send("Uspesno postavljeno na " + role.name + " :)");
          Ourrole = args[1];
        }
      })
      .catch(console.error);
  }
});

client.on("voiceStateUpdate", (oldState, newState) => {
  if (Ourrole == null) {
  } else {
    if (newState.mute || newState.channelID == null)
      newState.member.roles.add(Ourrole);
    else newState.member.roles.remove(Ourrole);
  }
});

client.login(process.env.TOKEN);
