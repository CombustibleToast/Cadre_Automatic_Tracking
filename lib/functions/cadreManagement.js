const { } = require("discord.js")

module.exports = [
	{
		name: "test1",
		async execute(interaction){
			await interaction.reply(`Hello1 ${interaction.user.username}.`);
		}
	},
	{
		name: "test2",
		async execute(interaction){
			await interaction.reply(`Hello2 ${interaction.user.username}.`);
		}
	}
]