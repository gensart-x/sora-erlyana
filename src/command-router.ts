import { Client, Message } from 'whatsapp-web.js'
import { commands } from '@/command-hive'
import * as wweb from '@utils/wweb'
import config from '@/env'

const routeCommand = async (client: Client, message: Message) => {

    // Read the message
    await client.sendSeen(message.from);

    // From 1.0, adding some random delay
    // todo : needs some proper implementation, and testable
    await new Promise(resolve => setTimeout(resolve, [1000, 2000][Math.round(Math.random())]));

    const type: string = message.type;
    const command: string = message.body;

    // From 1.0, for now the bot only listen to text/chat or image messages, otherwise ignore it
    if (['chat', 'image', 'video'].includes(type) == false) {
        return 0;
    }

    const extractedCommand: string = command.split(' ')[0];

    if (extractedCommand in commands) {
        await commands[extractedCommand](client, message);
    } else {
        const contact = await message.getContact();
        wweb.sendMessage(
            client,
            message.from,
            `${config.botShortName} gak ngerti maksudnya apa😢. Coba ketik \`.help\` biar tau yang ${config.botShortName} paham, makasi ${contact?.pushname ?? ''}☺!`
        )
    }
}

export default routeCommand