// Node utilities
import fs from 'node:fs';
import path from 'node:path';

// Discord.js imports
import {Client, Events, GatewayIntentBits, Collection} from "discord.js";
import config from "./secrets.json" with { type: 'json' };
const token = config.token;

// Init client
const client = new Client({intents: [GatewayIntentBits.Guilds]});

// Login
client.login(token);

// Load commands
const __dirname = import.meta.dirname; //ESM Compatibility

// Find all command files
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'lib/slash_commands');
const commandFiles = [];
getAllNestedFiles(commandsPath, commandFiles);
// Put commands in the collection
for (const file of commandFiles) {
    const command = await import(file);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
    }
}

//Same as above but for custom functions
client.functions = new Collection();
const functionsPath = path.join(__dirname, 'lib/functions');
const functionFiles = [];
getAllNestedFiles(functionsPath, functionFiles);
for (const file of functionFiles) {
    let customFunctions = await import(file);
    // Convert to a list if it's not already. Some files are [{name, exe}, ...], some are {name, exe}
    if(!(Array.isArray(customFunctions)))
        customFunctions = [customFunctions];

    for(let functionObject of customFunctions){
        if ('name' in functionObject && 'execute' in functionObject){
            if (client.functions.get(functionObject.name)) //Ugly if
                console.log(`[WARN] Function ${functionObject.name} already exists and was overwritten!`);
            client.functions.set(functionObject.name, functionObject);
        }
        else
            console.log(`A function object in ${file} is missing a name or executable.`);
    }
}

// Install event handlers
// Commands and functions are executed via the interactionCreate event, loaded here
//https://discordjs.guide/creating-your-bot/event-handling.html#reading-event-files
console.log("events")
const eventsPath = path.join(__dirname, 'lib/events');
console.log(eventsPath)
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
console.log(eventFiles)
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}


// --Helpers--
function getAllNestedFiles(rootDirectory, fileList) {
	fs.readdirSync(rootDirectory).forEach(File => {
		const filePath = path.join(rootDirectory, File);
		if (fs.statSync(filePath).isDirectory()) {
			return getAllNestedFiles(filePath, fileList);
		}
		else {
			return fileList.push(filePath);
		}
	});
}