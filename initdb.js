// const { JSONFilePreset } = require("lowdb")
import { JSONFilePreset } from 'lowdb/node'

async function main(){
	const db = await JSONFilePreset('db.json', {
		version: 1,
		cadres: [], 
		players: [],
		characters: []
	})
}

main();