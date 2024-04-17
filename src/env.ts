import 'dotenv/config';

/**
 * This object is used as dotenv bridge  
 * so we can add some information  
 * to each variable stored on dotenv.
 */
const environmentConfiguration = {
    /**
     * The property name clearly says it, this is for global configuration
     */
    isSendingMessageEnabled: true,

    /**
     * Bot full name, for example : Sora Erlyana
     */
    botName: process.env.BOT_NAME,

    /**
     * Bot short name, for example : Sora
     */
    botShortName: process.env.BOT_SHORT_NAME,

    /**
     * Bot code name, for example : SoraErlyana
     */
    botCodeName: process.env.BOT_CODE_NAME,

    /**
     * Creator/Owner name
     */
    ownerName: process.env.OWNER_NAME,

    /**
     * imgBB API Key, see more at https://api.imgbb.com
     */
    imgBBKey: process.env.IMGBB_KEY,

    /**
     * Ghola AI chat API Token, see more at https://www.ghola.ai/developer
     */
    gholaToken: process.env.GHOLA_TOKEN,

    /**
     * Ghola AI associated account email, see more at https://www.ghola.ai/developer
     */
    gholaEmail: process.env.GHOLA_EMAIL,

    /**
     * Ghola AI bot profile ID, see more at https://www.ghola.ai/developer
     */
    gholaProfileId: process.env.GHOLA_AI_PROFILE_ID,

    //     BANK_ACCOUNT = 'your-bank-account-if-needed'
    // TRAKTEER_LINK = 'teer.id/gensart

    /**
     * Bank Account Information, use if needed.
     */
    bankAccountInfo: process.env.BANK_ACCOUNT,

    /**
     * Trakteer Linkteer link, for donation support.
     */
    trakteerLink: process.env.TRAKTEER_LINK
}

export default environmentConfiguration