import { Executor } from '@/command-hive'
import * as logger from '@utils/logger'
import * as wweb from '@utils/wweb'
import config from '@/env'

const log: Executor = async (client, message) => {
    // Extract the commands
    const text = message.body.split(' ');
    const logType: string = text[1];
    let logFile: string;

    switch (logType) {
        case 'error':
            logFile = logger.ERROR_LOG_FILE;
            break;
        default:
            wweb.replyMessage(message, 'Gunakan `error` sebagai argumen untuk `.log [argument]`')
            return 0;
    }

    try {

        // * (for-current-dev) If not Genes who access this log, deny it
        const contact = (await message.getContact()).pushname ?? 'unknown';
        if (contact != 'Genesaret Johnes') {
            return 0;
        }

        const logs: string = logger.fetchLog(logFile);

        // * (for-current-dev) Showing the chat id for dev purpose
        wweb.sendMessage(client, message.from, 'Chat ID used : ' + message.from);

        if (logs != '') {
            wweb.replyMessage(message, logs)
        } else {
            wweb.replyMessage(message, `${config.botShortName} tidak melihat ada log saat ini.`)
        }
    } catch (error) {
        wweb.replyMessage(message, 'Terjadi kesalahan saat memuat log.\n\n' + (error as Error).message)
    }
}

export {
    log
}