interface EnvironmentConfiguration {
    /**
     * Is sending any WhatsApp message allowed ?
     */
    isSendingMessageEnabled: boolean,

    /**
     * Bot full name
     */
    botName: string,

    /**
     * Bot short name
     */
    botShortName: string,

    /**
     * Bot codename
     */
    botCodeName: string,

    /**
     * Owner name of the bot
     */
    ownerName: string
}

const environmentConfiguration: EnvironmentConfiguration = {
    isSendingMessageEnabled: true,

    botName: 'Sora Erlyana',
    botShortName: 'Sora',
    botCodeName: 'SoraErlyana',
    ownerName: 'Genesaret Johnes'
}

export default environmentConfiguration