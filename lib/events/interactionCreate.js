const { Events, MessageFlags } = require('discord.js');
const { productionGuildId, minimumCooldownTimeMs } = require('../../config.json');

//on interaction...
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        //check if this iteration of the bot services this guild but allow all DMs
		//TODO: Implment dynamic guild id like in deploy_commands.js
        // if(interaction.guild != null && interaction.guild.id != productionGuildId){
        //     console.log(`Received a request from another guild ${interaction.guild.id}`);
        //     return;
        // }
        
        // Check if the user is on cooldown
		if(await cooldownCheck(interaction.user.id))
            return;

        //handle slash commands
        if (interaction.isChatInputCommand()) {
            //console.log(interaction);

            //store the command
            const command = interaction.client.commands.get(interaction.commandName);
            console.log(`${interaction.user.tag} is performing command ${interaction.commandName}`);

            //try executing the command
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if(!interaction.replied && !interaction.deferred)
                    await interaction.reply({ content: 'There was an error while executing your command.', flags: MessageFlags.Ephemeral });
                else
                    await interaction.followUp({ content: 'There was an error while executing your command.', flags: MessageFlags.Ephemeral });
            }
            return;
        }
        
        //handle functions
        const funcName = /[a-zA-Z]+/.exec(interaction.customId)[0]; //TODO: CustomID system not yet implemented
        console.log(`${interaction.user.tag} is performing function ${funcName}`);

        //get the associated function
        const func = interaction.client.functions.get(funcName);

        //try executing the function
        try {
            await func.execute(interaction);
        }
        catch (e) {
            console.error(`[WARN] Error processing function ${funcName}:\n${e.stack}`);
            try{
                if(!interaction.replied && !interaction.deferred)
                    await interaction.reply({content: "There was an error processing your request.", flags: MessageFlags.Ephemeral});
                else
                    await interaction.followUp({content: "There was an error processing your request.", flags: MessageFlags.Ephemeral});
            }
            catch(e){
                console.log(`[INFO] Unable to reply to user after function failure:\n${e.stack}`);
            }
        }
    }
}

async function cooldownCheck(userId){
	if(userId == "122065561428426755") //my superpower
		return false;

	const cooldowns = interaction.client.cooldowns;
	if(cooldowns.has(userId)){
		//user is on cooldown, reply to them as such and don't do anything else.
		console.log(`User is on cooldown: ${interaction.user.tag}`);
		await interaction.reply({content: `Rate limited. Wait a second and try again.`, flags: MessageFlags.Ephemeral});
		return true;
	}

	// User is not on cooldown, add them to the list, and remove them from it after the cooldown elapses
	// TODO: implement custom cooldown time per function, using the minimum time if less than or omitted
	cooldowns.set(userId, interaction);
	setTimeout(() => {
			cooldowns.delete(userId);
		}, 
		minimumCooldownTimeMs);
	
	return false
}