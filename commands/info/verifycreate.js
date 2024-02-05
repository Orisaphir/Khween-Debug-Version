const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const Admins = require('../../modules/Admin')
const Infos = require('../../modules/Infos');

module.exports = {
    
    command : new SlashCommandBuilder()
        .setName('verifycreate')
        .setDescription("Créer le message de vérification")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption((options) => 
            options
                .setName("force")
                .setDescription("Forcer l'envoi du message de vérification")
                .setRequired(true)
                .addChoices({ name: 'True', value: 1 }, { name: 'False', value: 0 })
        ),

    async run(client, inter) {

        const GetForce = inter.options.getInteger("force");
        let force = false;
        if (GetForce === 1)
            force = true;
        const verifychannelInfos = await Infos.findOne({ where: { Infos: "verifychannel" } });
        const verifyroleInfos = await Infos.findOne({ where: { Infos: "verifyrole" } });
        const adminInfos = await Admins.findOne({ where: { Module: "verify" } });
        if (verifychannelInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez configurer le Channel où sera envoyé le message de vérification avec la commande /verifyconfig", ephemeral: true });
        if (verifyroleInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez configurer le Rôle qui sera donné avec la commande /verifyconfig", ephemeral: true });
        if (adminInfos.Valeur === false) return inter.reply({ content: "Le module est désactivé, veuillez l'activer avec la commande /setup", ephemeral: true });

        const verifychannel = verifychannelInfos.DiscordID;
        const verifyrole = verifyroleInfos.DiscordID;
        try {
            const CheckChannel = await inter.guild.channels.cache.get(verifychannel);
            if (!CheckChannel) {
                await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "verifychannel" } });
                return inter.reply({ content: "Le salon de vérification n'existe plus ou est introuvable. Merci de le reconfigurer avec la commande /verifyconfig !", ephemeral: true });
            }
        } catch (err) {
            console.log(err);
            return inter.reply({ content: "Une erreur est survenue à la création du message de vérification. Merci de contacter @Orisaphir au plus vite.", ephemeral: true });
        }
        try {
            const CheckRole = await inter.guild.roles.cache.get(verifyrole);
            if (!CheckRole) {
                await Infos.update({ DiscordID: null, Valeur: false }, { where: { Infos: "verifyrole" } });
                return inter.reply({ content: "Le rôle de vérification n'existe plus ou est introuvable. Merci de le reconfigurer avec la commande /verifyconfig !", ephemeral: true });
            }
        } catch (err) {
            console.log(err);
            return inter.reply({ content: "Une erreur est survenue à la création du message de vérification. Merci de contacter @Orisaphir au plus vite.", ephemeral: true });
        }
        if (force === false) {
            const CheckMessage = await inter.guild.channels.cache.get(verifychannel).messages.fetch({ limit: 1 });
            if (CheckMessage.size !== 0) return inter.reply({ content: "Le message de vérification est déjà envoyé (le salon ne doit comporter aucun message)", ephemeral: true });
        }

        const { guild } = inter

        const embed = new EmbedBuilder()
            .setTitle("Vérification")
            .setDescription("Clique sur « vérifier » si t'es pas un alien !")
            .setColor("#00FF00")
        
        const button = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId("verify").setLabel("Vérifier").setStyle(ButtonStyle.Success).setEmoji('✅'),
        );

        await guild.channels.cache.get(verifychannel).send({
            embeds: ([embed]),
            components: [
                button
            ]
        });

        inter.reply({content: "Le message de vérification a bien été envoyé", ephemeral: true});
    }
}