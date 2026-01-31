// Node utilities
import fs from 'node:fs';
import path from 'node:path';

// Discord.js imports
import {Client, Events, GatewayIntentBits, Collection} from "discord.js";
import secrets from "./secrets.json" with { type: 'json' };
const token = secrets.token;

// Init client
const client = new Client({intents: [GatewayIntentBits.Guilds]});

// Login (don't await, we load the events while it logs in (probably a bad idea?))
client.login(token);

const __dirname = import.meta.dirname; //ESM Compatibility

// Load commands
// Find all command files
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'lib/slash_commands');
const commandFiles = [];
getAllNestedFiles(commandsPath, commandFiles);
for (const file of commandFiles) {
    const commandFile = await import(file);
    Object.keys(commandFile).forEach((objectKey) => {
        const commandObject = commandFile[objectKey]

        if('data' in commandObject && 'execute' in commandObject){
            client.commands.set(commandObject.data.name, commandObject)
        }
        else
            console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
    })
}

//Same as above but for custom functions
client.functions = new Collection();
const functionsPath = path.join(__dirname, 'lib/functions');
const functionFiles = [];
getAllNestedFiles(functionsPath, functionFiles);
for (const file of functionFiles) {
    let customFunctions = await import(file);
    Object.keys(customFunctions).forEach((objectKey) => {
        const functionObject = customFunctions[objectKey];
        
        if ('name' in functionObject && 'execute' in functionObject){
            if (client.functions.get(functionObject.name)) //Ugly if
                console.log(`[WARN] Function ${functionObject.name} already exists and was overwritten!`);
            client.functions.set(functionObject.name, functionObject);
        }
        else
            console.log(`A function object in ${file} is missing a name or executable.`);
    })
}

// Install event handlers
// Commands and functions are executed via the interactionCreate event, loaded here
//https://discordjs.guide/creating-your-bot/event-handling.html#reading-event-files
const eventsPath = path.join(__dirname, 'lib/events');
const eventFiles = [];
getAllNestedFiles(eventsPath, eventFiles);
for (const filePath of eventFiles) {
    const eventObjects = await import(filePath);
    Object.keys(eventObjects).forEach(objectKey => {
        const event = eventObjects[objectKey];
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    })
}

// --Helpers--
function getAllNestedFiles(rootDirectory, fileList) {
	fs.readdirSync(rootDirectory).forEach(File => {
		const filePath = path.join(rootDirectory, File);
		if (fs.statSync(filePath).isDirectory()) {
			return getAllNestedFiles(filePath, fileList);
		}
		else {
			return fileList.push("file://" + filePath);
		}
	});
}