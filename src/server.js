import "dotenv"
import {BLOCKED_WORDS} from "./constants.js";
import tmi from "tmi.js"

const client = new tmi.Client({
    connection: {
        reconnect: true
    },
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_ACCESS_TOKEN
    },
    channels: [ process.env.TWITCH_BOT_USERNAME ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    console.log(`${tags['display-name']}: ${message}`);
    if(self) return
    if(tags.username === process.env.TWITCH_BOT_USERNAME) return;
    if(message.toLowerCase() === "!hello") {
        client.say(channel, `@${tags.username}, heya!`)
    }
    checkTwitchChat(channel, tags, message);
});

function checkTwitchChat(channel, tags, message) {
    message = message.toLowerCase();
    let shouldSendMessage = false;
    shouldSendMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()));
    if(shouldSendMessage) {
        //tell user
        client.say(channel, `@${tags.username}, sorry! Your message was deleted.`);
        //delete message
        client.deletemessage(channel, tags.id)
    }
}