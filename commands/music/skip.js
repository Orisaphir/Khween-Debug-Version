const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {

    command: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('passe à la prochaine musique')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    async run(client, message, args) {
        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply({content: `Il n'y a pas de musique diffusée actuellement !`, ephemeral: true});

        if (message.guild.members.me.voice.channel && message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply({content: "Tu ne peux pas me demander ça sans être dans le même channel que moi D:", ephemeral: true});

        const success = queue.skip();

        return message.reply(success ? {content: `Pas de soucis je te joue la prochaine musique !`, ephemeral: true} : {content: `J'ai eu un soucis lors du skip !`, ephemeral: true});
    },
};