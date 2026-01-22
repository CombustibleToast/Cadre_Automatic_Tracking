// Node utilities
const fs = require('node:fs');
const path = require('node:path');

// Discord.js imports
const {Client, Events, GatewayIntentBits, Collection} = require("discord.js")
const {token} = require("./secrets.json")

// Init client
const client = new Client({intents: [GatewayIntentBits.Guilds]})

// Login
client.login(token)

// Load commands
// Find all command files
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'lib/slash_commands');
const commandFiles = [];
getAllNestedFiles(commandsPath, commandFiles);
// Put commands in the collection
for (const file of commandFiles) {
    const command = require(file);
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
    const customFunction = require(file);
    if ('name' in customFunction && 'execute' in customFunction)
        client.functions.set(customFunction.name, customFunction);
    else
        console.log(`The custom function ${file} is missing a name or executable.`);
}

// Install event handlers
// Commands and functions are executed via the interactionCreate event, loaded here
//https://discordjs.guide/creating-your-bot/event-handling.html#reading-event-files
const eventsPath = path.join(__dirname, 'lib/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
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