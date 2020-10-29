const Discord = require("discord.js");

var mysql = require("mysql");
var con = mysql.createConnection({
  host: "remotemysql.com",
  user: "dahNxUBY0g",
  password: "E4EagKV2XR",
  database: "dahNxUBY0g",
  port: "3306"
});

const client = new Discord.Client();
const prefix = "p!";

con.connect(function(err) {
  if (err) throw err;
  console.log("MySQL connected!");
});
setInterval(function() {
  con.query("SELECT 1");
}, 5000);

let binds = new Map();

client.once("ready", () => {
  con.query("SELECT * FROM bindings", function(err, result, fields) {
    if (err) throw err;
    for (let i = 0; i < result.length; i++)
      binds.set(result[i].key1, result[i].value1);
  });
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
        message.channel.send("Uspesno spojen " + vc.name + " sa " + tc.name);
        binds.set(args[1], args[2]);
        con.query(
          "INSERT INTO bindings (key1, value1) VALUES (" +
            args[1] +
            ", " +
            args[2] +
            ")",
          function(err, result) {
            if (err) throw err;
          }
        );
      } else message.channel.send("TC::nije dat tc :(");
    } else message.channel.send("VC::nije dat vc :(");
  } else if (args[0] === "unbind") {
    let vc = message.guild.channels.resolve(args[1]);
    if (vc == null)
      message.channel.send("VC::Pogresno ukucano ili ne postoji :(");
    else if (vc.type === "voice")
      if (!(binds.get(args[1]) == null)) {
        message.channel.send("Uspesno oslobodjen " + vc.name);
        binds.delete(args[1]);
        con.query("DELETE FROM bindings WHERE key1 = " + args[1], function(
          err,
          result
        ) {
          if (err) throw err;
        });
      } else message.channel.send("VC::nije bio bindovan :(");
    else message.channel.send("VC::nije dat vc :(");
  }
});

client.on("voiceStateUpdate", (oldState, newState) => {
  const user = newState.member;
  const channels = newState.guild.channels;
  let channel = null;
  if ((channel = channels.resolve(binds.get(oldState.channelID))) == null)
    if ((channel = channels.resolve(binds.get(newState.channelID))) == null) {
    } else
      channel.updateOverwrite(user, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: newState.mute
      });
  else if (binds.get(newState.channelID) == null)
    channel.updateOverwrite(user, {
      VIEW_CHANNEL: false,
      SEND_MESSAGES: newState.mute
    });
  else {
    if (channel == channels.resolve(binds.get(newState.channelID))) {
    } else
      channel.updateOverwrite(user, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: newState.mute
      });
    channels.resolve(binds.get(newState.channelID)).updateOverwrite(user, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: newState.mute
    });
  }
});

client.login(process.env.TOKEN);
