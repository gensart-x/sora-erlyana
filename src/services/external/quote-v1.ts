import axios, { AxiosError } from 'axios'
import { Executor } from '@/command-hive'
import * as wweb from '@utils/wweb'
import * as translate from '@utils/translation'
import * as logger from '@utils/logger'

type Quote = {
    quote: string,
    author: string
}

const getForismaticQuotes: Executor = async (client, message) => {
    try {
        // Quote retrieval
        const forismaticApiUrl: string = 'http://api.forismatic.com/api/1.0/json?method=getQuote&format=json&lang=en';
        const quoteResponse = await axios.post(forismaticApiUrl);
        const quote: Quote = {
            quote: quoteResponse.data.quoteText,
            author: quoteResponse.data.quoteAuthor
        };

        if (quote.author == '') {
            quote.author = '(tanpa nama)';
        }
        const translation = await translate.microsoft(quote.quote, 'en', 'id');

        if (translation.success) {
            wweb.sendMessage(client, message.from, 'By ' + quote.author);
            wweb.sendMessage(client, message.from, translation.text);
        } else {
            wweb.replyMessage(message, translation.error ?? 'Gagal memuat quotes, silahkan coba lagi.');
        }

    } catch (e) {
        const contact = await message.getContact();
        const err = e as AxiosError | Error;
        logger.logError('quoteV1Forismatic - ' + err.message + ' by ' + (contact?.pushname ?? 'unknown'));

        wweb.replyMessage(message, 'Gagal memuat quotes, silahkan coba lagi.')
    }
}

export {
    getForismaticQuotes
}