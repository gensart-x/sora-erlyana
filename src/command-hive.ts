import { Client, Message } from 'whatsapp-web.js'
import { getForismaticQuotes } from '@services/external/quote-v1'
import { textProSingleTextRouter } from '@services/external/textpro'
import commandGuide from '@services/internal/command-guide'
import imageToSticker from '@services/internal/image-to-sticker'
import { translateEnglishToIndo, translateIndoToEnglish } from '@services/external/translate'
import { imageToStickerText } from '@services/external/image-to-sticker-meme'
import { log } from '@services/internal/log'
import { indoSlangQuote } from '@services/internal/quote-indo-slang'
import { getPpCouple } from '@services/internal/pp-couple'
import { ghola } from '@services/external/ghola'
import { requestInfo } from '@services/internal/request-info'
import { donation } from '@services/internal/donation'
import { botInfo } from '@services/internal/bot-info'
import { cookpadRecipe } from '@services/external/cookpad'
import coloredText from '@services/external/colored-text'
import imageHd from '@services/external/image-hd'
import { getlistMails, getMailMessages, readMail } from '@services/external/onesecmail'

type Commands = {
    [key: string]: Executor
}
type Executor = (client: Client, message: Message) => void

const commands: Commands = {

    // ! Administrative commands
    '.log': log,

    // * Request Feature
    '.request': requestInfo,

    // * Help Information
    '.commands': commandGuide,
    '.perintah': commandGuide,
    '.list': commandGuide,
    '.menu': commandGuide,
    '.help': commandGuide,
    '.botinfo': botInfo,

    // * Cookpad
    '.resep': cookpadRecipe,

    // * Quotes
    '.quotes': getForismaticQuotes,
    '.indoquotes': indoSlangQuote,

    // * Random Image
    '.ppcouple': getPpCouple,

    // * AI-generated
    '.tanya': ghola,

    // * Translation
    '.engtoindo': translateEnglishToIndo,
    '.indotoeng': translateIndoToEnglish,

    // * Image to sticker
    '.s': imageToSticker,
    '.st': imageToStickerText,
    '.attp': coloredText,

    // * Picture Feature
    '.hd': imageHd,

    // * Email generation
    '.buatemail': getlistMails,
    '.cekemail': getMailMessages,
    '.bacaemail': readMail,

    // * Donation
    '.donasi': donation
}

export {
    Commands, Executor, commands
}