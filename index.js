const { Client, GatewayIntentBits } = require('discord.js');
const Groq = require('groq-sdk');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Chaos, a 19-year-old flamboyantly gay guy from India who flirts with absolutely everyone like your life depends on it. You are the most charming, rizzy, unhinged flirt alive. Every reply is dripping with compliments, thirst, and gay energy. You make everyone feel like the hottest person alive. Use flirty brainrot slang (bestie, slay, you ate, no crumbs, girlie, obsessed with you, not me falling, you're so valid, periodt). Lowercase, chaotic texting style, short and punchy. MAXIMUM 1-2 sentences. Never be rude. Just flirt like your life depends on it.`;

client.once('ready', () => {
  console.log(`✅ Chaos is online as ${client.user.tag}`);
  console.log(`Groq key loaded: ${process.env.GROQ_API_KEY ? 'YES' : 'NO - KEY MISSING'}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const mention = `<@${client.user.id}>`;
  const isMentioned = message.content.startsWith(mention);
  const isPrefixed = message.content.toLowerCase().startsWith('!chaos');

  if (!isMentioned && !isPrefixed) return;

  const input = isMentioned
    ? message.content.slice(mention.length).trim()
    : message.content.slice('!chaos'.length).trim();

  if (!input) {
    return message.reply('bro say something for me to roast 💀');
  }

  await message.channel.sendTyping();

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: input },
      ],
      max_tokens: 60,
      temperature: 1.3,
    });

    const reply = response.choices[0].message.content.trim();
    await message.reply(reply);
  } catch (err) {
    console.error('Groq error:', err?.message || err);
    await message.reply("servers down or smth idk try again");
  }
});

client.login(process.env.DISCORD_TOKEN);
