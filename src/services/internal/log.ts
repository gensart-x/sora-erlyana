import { Executor } from '@/command-hive'
import * as logger from '@utils/logger'
import * as wweb from '@utils/wweb'
import config from '@/env'

const MAX_LOG_LINES = 50; // Limit to prevent message overflow and excessive internal path exposure

const log: Executor = async (client, message) => {

    // If the chat ID is not same with the registered WhatsApp chat id in the env, ignore it
    if (message.from != config.whatsappChatId) {
        await client.sendSeen(message.from)
        return 0
    }

    // Extract the commands
    const text = message.body.split(' ');
    const logType: string = text[1];
    let logFile: string;

    switch (logType) {
        case 'error':
            logFile = logger.ERROR_LOG_FILE;
            break;
        default:
            logFile = logger.ERROR_LOG_FILE;
            wweb.sendMessage(client, message.from, 'Menampilkan log ERROR sebagai default')
            break;
    }

    try {
        const logs: string = logger.fetchLog(logFile);

        if (logs != '') {
            // Limit to last N lines and sanitize local paths
            const lines = logs.trim().split('\n');
            const limitedLines = lines.slice(-MAX_LOG_LINES);
            const sanitized = limitedLines.join('\n').replace(/\/home\/[^/]+/g, '/home/[user]');
            wweb.replyMessage(message, sanitized);
        } else {
            wweb.replyMessage(message, `${config.botShortName} tidak melihat ada log error saat ini.`)
        }
    } catch (error) {
        wweb.replyMessage(message, 'Terjadi kesalahan saat memuat log.\\n\\n' + (error as Error).message)
    }
}

export {
    log
}