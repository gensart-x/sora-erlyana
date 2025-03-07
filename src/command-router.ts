import { Client, Message } from 'whatsapp-web.js'
import { commands } from '@/command-hive'
import * as wweb from '@utils/wweb'
import commandMiddlewares from '@/command-middleware'
import { logError } from './utils/logger'

const routeCommand = async (client: Client, message: Message) => {
    // Running command middlewares
    commandMiddlewares.emit(client, message)
        .then(isAllowedToContinue => {
            if (isAllowedToContinue) {
                // If allowed to continue after running middlewares, route the command
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
        })
        .catch(error => {
            logError(error)
            wweb.sendMessage(
                client,
                message.from,
                'Maaf, terjadi kesalahan saat memproses perintah. Silahkan coba kembali nanti ya'
            )
        })
}

export default routeCommand