const { Client, IntentsBitField } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const bot = new Client({ intents: [IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMessages] });

const CHATPDF_API_TOKEN = process.env.CHATPDF_API_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

bot.once('ready', async () => {
  console.log('Bot está online!');

  const commands = [
    {
      name: 'duvida',
      description: 'Obtém informações sobre como funciona o chatPDF.',
    },
  ];

  try {
    const guild = await bot.guilds.fetch(GUILD_ID);
    await guild.commands.set(commands);
    console.log('Slash Command registrado com sucesso!');
  } catch (error) {
    console.error('Erro ao definir os comandos:', error);
  }
});

bot.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'duvida') {
    if (interaction.guildId !== GUILD_ID) {
      return interaction.reply('Este comando só pode ser executado neste servidor específico.');
    }

    try {
      //Url apenas para teste de código
      const response = await axios.get(`https://api.chatpdf.com/v1/chat/como-funciona?token=${CHATPDF_API_TOKEN}`, {
        headers: {
          Authorization: `Bearer ${CHATPDF_API_TOKEN}`,
        },
      });

      const responseString = response.data("Teste");
      interaction.reply(responseString);
    } catch (error) {
      console.error('Erro ao obter informações do chatPDF:', error.message);
      interaction.reply('Ocorreu um erro ao obter as informações do chatPDF.');
    }
  }
});

bot.login(process.env.DISCORD_TOKEN);
