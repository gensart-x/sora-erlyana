import { Client, Message } from 'whatsapp-web.js'
import { commands } from '@/command-hive'
import * as wweb from '@utils/wweb'
import commandMiddlewares from '@/command-middleware'

const routeCommand = async (client: Client, message: Message) => {

    // Try to read the message first.
    await client.sendSeen(message.from)

    // Running command middlewares
    commandMiddlewares.emit(client, message)
    
    const extractedCommand: string = message.body.split(' ')[0];
    if (extractedCommand in commands) {
        commands[extractedCommand](client, message);
    } else {
        wweb.sendMessage(
            client,
            message.from,
            'Coba ketik `.help` ☺.\n\n> _Try to type `.help` for more._'
        )
    }
}

export default routeCommand