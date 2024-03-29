import { AxiosError } from 'axios';
import fs from 'fs'
import path from 'path'
import { Executor } from '@/command-hive'
import * as wweb from '@utils/wweb'
import * as logger from '@utils/logger'

const QUOTES_DIRECTORY = 'assets';
const QUOTES_FILE = 'quotes-indo-slang.json';

const getIndoSlangQuote = () => {
    const quotes = JSON.parse(fs.readFileSync(path.join(QUOTES_DIRECTORY, QUOTES_FILE), 'utf-8'));
    return quotes[Math.floor(Math.random() * quotes.length)]
}

const indoSlangQuote: Executor = async (client, message) => {
    try {
        const slangQuote = getIndoSlangQuote();
        wweb.replyMessage(message, slangQuote);
    } catch (error) {
        const err = error as AxiosError;
        const contact = await message.getContact();
        logger.logError('quoteIndoSlang - ' + err.message + ' by ' + contact?.pushname ?? 'unknown');

        wweb.replyMessage(message, 'Maaf, terjadi kesalahan saat memuat quotes. Silahkan coba kembali nanti ya');
    }
}

export {
    indoSlangQuote
}