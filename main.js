// Response for Uptime Robot
const http = require("http");
http
  .createServer(function(request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Discord bot is active now \n");
  })
  .listen(3000);

// Discord bot implements
const discord = require("discord.js");
const client = new discord.Client();

function safeEval(val) {
  return Function('"use strict";return (' + val + ")")();
}
client.on("ready", message => {
  console.log("bot is ready!");
});

client.on("message", message => {
  if (message.author.bot) {
    console.log("my message");
    return;
  }
  if (message.content === "コマンド") {
    message.reply(
      "\nコマンド一覧\n[2DR<=目標値] 2DRが振れます。\n6ゾロクリティカル,5ゾロファンブル,成否アリ\n[(数値1)d(数値2)] ダイスを振って計算式に置換して出力します。\n計算は自分で頑張ってください。\n[コマンド] コマンド一覧が出ます。"
    );
    return;
  }
  if (/command/i.test(message.content)) {
    message.reply(
      "\nCommand List\n[2DR<=target] Roll the dice by 2DR.\nCritical if boxcars.Fumble when the dice match five.There is a success or failure judgment.\n[(num1)d(num2)] Roll the dice.There is NOT a success or failure judgment.\n[command] Respond with a command list."
    );
    return;
  }
  console.log(message.content);
  var m = message.content.match(/^2DR ?<= ?(\d+[ \+\-]?)+/i);
  console.log(m);
  if (m != null) {
    const x = Math.floor(Math.random() * (6 - 1));
    const y = Math.floor(Math.random() * (6 - 1));
    if (x === 5 && y === 5) {
      message.reply("2DR:5+5=10 fumble...(EP:0)");
      return;
    }
    if (x + y === 0) {
      message.reply("2DR:0+0=0 critical!!!(EP:2)");
      return;
    }
    const target_num = m[0].match(/(\d+\s?[\+\-]?\s?)+/gi)[1];
    console.log(target_num);
    const target = safeEval(target_num);
    const judgement = x + y <= target ? "Success!" : "failure";
    const six = x === 0 || y === 0 ? 1 : 0;
    let msg = "\n2DR:" + x + "+" + y;
    msg += "=" + (x + y);
    msg += " " + (x + y) + "<=" + target;
    msg += "\n" + judgement;
    msg += "(EP:" + six + ")";
    const success_level = target - (x + y);
    if (success_level >= 0) msg += "(ScLv:" + success_level + ")";
    message.reply(msg);
    return;
  }
  let msg = message.content;
  m = msg.match(/^\d+d\d+/i);
  if (m == null) return;
  m = msg.match(/\d+d\d+/gi);
  //サイコロを振る
  while (m != null) {
    const dice = m[0].match(/\d+/gi);
    let rep_msg = "";
    //m[0]回m[1]面サイコロを振る
    for (let i = 0; i < Number(dice[0]); i++) {
      const d = Math.floor(Math.random() * (dice[1] - 1)) + 1;
      rep_msg += d + "+";
    }
    rep_msg = rep_msg.slice(0, -1);
    console.log(rep_msg);
    //msgの中のm[0]をrep_msgに置き換える
    msg = msg.replace(m[0], rep_msg);
    m = msg.match(/\d+d\d+/gi);
  }
  console.log(msg);
  message.reply(msg);
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.log("please set ENV: DISCORD_BOT_TOKEN");
  process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);
