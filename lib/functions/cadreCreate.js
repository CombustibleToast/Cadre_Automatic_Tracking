import { MessageFlags, ChannelType, PermissionFlagsBits } from "discord.js";
// const { JSONFilePreset } = require("lowdb")
export {create};

const create = {
	name:  "createCadre",
	async execute(interaction){
		// await interaction.reply(`Cadre Create placeholder ${interaction.user.username}.`);
		await interaction.deferReply({flags: MessageFlags.Ephemeral});

		// Collect modal info
		const cadreName = interaction.fields.getTextInputValue("cadreName");
		const roleColor = interaction.fields.getTextInputValue("roleColor");
		const confirmation = interaction.fields.getTextInputValue("confirmation");

		// Check confirmation
		// if(confirmation.toLowerCase() != "confirm"){
		// 	await interaction.followUp("You did not fill out the confirmation properly. Please try again.");
		// 	return;
		// }

		// Create Role 
		const role = await interaction.guild.roles.create({
			name: cadreName,
			reason: `Requested by ${interaction.user.name}.`,
			colors: {
				primaryColor: roleColor
			}
		});
		await interaction.member.roles.add(role);

		// Create Category
		const category = await interaction.guild.channels.create({
			name: cadreName,
			type: ChannelType.GuildCategory,
			permissionOverwrites: [
				{
					id: interaction.guild.id,
					deny: [
						PermissionFlagsBits.ViewChannel
					]
				},
				{
					id: role,
					allow: [
						PermissionFlagsBits.ViewChannel
					]
				}
			]
		});

		// Create OOC
		const ooc = await category.children.create({
			name: `${cadreName}-ooc`,
			type: ChannelType.GuildText
		})

		// Write new game to database

		await interaction.followUp("Done");
	}
}