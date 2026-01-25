const {SlashCommandBuilder, ModalBuilder, TextInputBuilder, LabelBuilder, TextInputStyle} = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("cadre")
		.setDescription("Manage a Cadre")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("create")
				.setDescription("Create a new Cadre. You will be the Handler.")
		),
	
	async execute(interaction){
		// Switch on which subcommand was chosen
		const subcommand = interaction.options.getSubcommand();
		console.log(`subcommand ${subcommand}`)

		//this DOES work but probably has many unforseen problems
		// eval(`${subcommand}(interaction)`)

		switch(subcommand){
			case("create"):
				create(interaction);
				break;
			default:
				throw new Error(`Subcommand ${subcommand} not found.`);
		}
	}
}

async function create(interaction){
	// This command just creates and pushes a modal. 
	// When the modal is submitted, the information from it will create the game in a different function
	const cadreNameInput = new TextInputBuilder()
		.setCustomId("cadreName")
		.setStyle(TextInputStyle.Short)
		.setPlaceholder("The name of your new Cadre or camapaign.")

	const cadreNameLabel = new LabelBuilder()
		.setLabel("Cadre Name")
		.setTextInputComponent(cadreNameInput)

	const colorInput = new TextInputBuilder()
		.setCustomId("roleColor")
		.setStyle(TextInputStyle.Short)
		.setPlaceholder("#RRGGBB")

	const colorLabel = new LabelBuilder()
		.setLabel("Role Color")
		.setTextInputComponent(colorInput)

	const confirmInput = new TextInputBuilder()
		.setCustomId("confirmation")
		.setStyle(TextInputStyle.Short)
		.setPlaceholder("Type \"confirm\".")

	const confirmLabel = new LabelBuilder()
		.setLabel("Confirmation")
		.setTextInputComponent(confirmInput)

	const modal = new ModalBuilder()
		.setCustomId("createCadre")
		.setTitle("Create New Cadre")
		.addLabelComponents([cadreNameLabel, colorLabel, confirmLabel])

	await interaction.showModal(modal);
}
