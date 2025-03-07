import { CommandMiddleware } from '@utils/middleware';
import fs from 'fs/promises';
import imageToSticker from './services/internal/image-to-sticker';

const middleware = new CommandMiddleware()

/**
 * ⚠ Do note that the order of the middleware matters  
 * 
 * Each middleware, return true if the execution should continue  
 * or false if the execution should stop.
 */

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