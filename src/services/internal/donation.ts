import { Executor } from '@/command-hive';
import config from '@/env';
import * as wweb from '@utils/wweb';

const donation: Executor = async (_, message) => {
    const informationArray = [
        `Kamu bisa bantu perkembangan ${config.botName} dengan mentraktir creator ${config.botShortName} ke metode dibawah :\n`,
        `Trakteer : ${config.trakteerLink}`,
        `Rekening Bank : ${config.bankAccountInfo}\n`,
        `Fitur ini masih dalam tahap pengembangan, karena saat kamu melakukan donasi, ${config.botShortName} perlu melakukan feedback yang tepat untuk menangani donasi kamu. Tapi creator sudah mulai open donasi saat ini kok :)`
    ];
    wweb.replyMessage(message, informationArray.join('\n'));
}

export {
    donation
}