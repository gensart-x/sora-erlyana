import { CommandMiddleware } from '@utils/middleware';
import fs from 'fs/promises';
import imageToSticker from './services/internal/image-to-sticker';
import config from '@/env';

const middleware = new CommandMiddleware()

// ── Rate Limiting ──
// Per-user cooldown to prevent command spam and API quota exhaustion
const RATE_LIMIT_MS = 2000; // 2 seconds between commands per user
const userCooldowns = new Map<string, number>();

/**
 * Clean up old entries from the cooldown map periodically
 * to prevent memory leaks from many unique users
 */
setInterval(() => {
    const now = Date.now();
    for (const [userId, lastTime] of userCooldowns.entries()) {
        if (now - lastTime > 60000) { // remove entries older than 60s
            userCooldowns.delete(userId);
        }
    }
}, 30000); // run cleanup every 30s

middleware.use(async (client, message) => {
    const now = Date.now();
    const lastTime = userCooldowns.get(message.from) ?? 0;

    if (now - lastTime < RATE_LIMIT_MS) {
        // Silently drop the message — don't spam the user with rate limit warnings
        return false;
    }

    userCooldowns.set(message.from, now);
    return true;
})

// If the message is from the bot owner, ignore it completely
middleware.use(async (_, message) => {
    if (message.from === config.whatsappChatId) {
        return false;
    }
    return true;
})

// Try to mark the message as seen.
middleware.use(async (client, message) => {
    client.sendSeen(message.from);
    return true;
})

// Adding some random delay, max. 1500ms
middleware.use(async () => {
    await new Promise(resolve => setTimeout(resolve, [0, 1500][Math.round(Math.random())]));
    return true
})

// The bot will only listen to text/chat or image with text messages, otherwise ignore it
middleware.use(async (_, message) => {
    const type: string = message.type;
    if (['chat', 'image', 'video'].includes(type) != false) {
        return true
    } else {
        return false
    }
})

// If the message is coming from group, ignore it.
middleware.use(async (_, message) => {
    const chat = await message.getChat();
    if (!chat.isGroup) {
        return true;
    } else {
        return false;
    }
})

// Handle image-only message as sticker
middleware.use(async (client, message) => {
    if ((message.type == 'image') && (message.body == '')) {
        imageToSticker(client, message)
        return false;
    } else {
        return true;
    }
})

// Record the number
middleware.use(async (_, message) => {
    try {
        await fs.access('assets/numbers.json', fs.constants.F_OK);
        const data = await fs.readFile('assets/numbers.json', 'utf-8');
        const numbers = JSON.parse(data);
        if (!numbers.includes(message.from)) numbers.push(message.from);
        await fs.writeFile('assets/numbers.json', JSON.stringify(numbers), 'utf-8');
        return true;
    } catch (e) {
        try {
            await fs.writeFile('assets/numbers.json', JSON.stringify([message.from]), 'utf-8');
            return true;
        } catch (writeError) {
            console.log(writeError);
            return false;
        }
    }
});

export default middleware