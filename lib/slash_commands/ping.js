const {SlashCommandBuilder} = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies to the command invoker"),
		async execute(interaction){
			await interaction.reply(`Hello ${interaction.user.username}.`);
		}
}