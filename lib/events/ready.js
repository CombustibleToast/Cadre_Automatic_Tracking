import  { Events, MessageFlags } from 'discord.js';

export {ready};

const ready = {
    name: Events.ClientReady,
    once: true,
    execute(client){
        console.log(`${client.user.username} ready.`)
    }
}