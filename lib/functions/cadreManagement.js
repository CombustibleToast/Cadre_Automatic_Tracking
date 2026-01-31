import { } from "discord.js";
export {test1, test2};

const test1 = {
	name: "test1",
	async execute(interaction){
		await interaction.reply(`Hello1 ${interaction.user.username}.`);
	}
}

const test2 = {
	name: "test2",
	async execute(interaction){
		await interaction.reply(`Hello2 ${interaction.user.username}.`);
	}
}