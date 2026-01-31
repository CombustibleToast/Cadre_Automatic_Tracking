import {SlashCommandBuilder}  from "discord.js";
export {ping};

const ping = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies to the command invoker"),

	async execute(interaction){
		await interaction.reply(`Hello ${interaction.user.username}.`);
	}
}