import axios from 'axios'
import { Executor } from '@/command-hive'
import * as wweb from '@utils/wweb'
import config from '@/env'
import * as logger from '@utils/logger'

const GHOLA_TOKEN_ENDPOINT = 'https://www.ghola.ai/api/v1/chat/init';
const GHOLA_CHAT_ENDPOINT = 'https://www.ghola.ai/api/v1/chat';

const retrieveGholaToken = async () => {
    const response = await axios.post(GHOLA_TOKEN_ENDPOINT, {
        token: config.gholaToken,
        email: config.gholaEmail,
        profileId: config.gholaProfileId
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return response.data.jwt ?? null;
}

const askGhola = async (token: string, message: string) => {
    const response = await axios.post(GHOLA_CHAT_ENDPOINT, {
        messages: [
            {
                role: "user",
                content: message
            }
        ]
    }, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    });

    return response.data?.message ?? null;
}

const ghola: Executor = async (client, message) => {
    const contact = await message.getContact();

    // Extract question from message
    const question: string = message.body.split(' ').slice(1).join(' ');

    if (question.length === 0) {
        wweb.replyMessage(message, `Berikan pertanyaan kamu kepada ${config.botShortName}, contoh : \`.tanya Hai, siapa kamu?\``);
        return 0;
    }

    const token: string | null = await retrieveGholaToken();
    if (token == null) {
        wweb.replyMessage(message, `${config.botShortName} tidak dapat menjawab pertanyaanmu saat ini, maaf :(`);
        logger.logError('tanyaGhola - Failed to retrieve Ghola AI token by ' + (contact.pushname ?? 'unknown'));
        return 0;
    }

    const answer: string = await askGhola(token, question);
    if (answer != null) {
        wweb.replyMessage(message, answer);
    } else {
        wweb.replyMessage(message, `${config.botShortName} tidak dapat menjawab pertanyaanmu saat ini, maaf :(`);
        logger.logError('tanyaGhola - Failed to retrieve Ghola question by ' + (contact.pushname ?? 'unknown'));
    }
}

export {
    ghola
}