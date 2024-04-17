import { Executor } from '@/command-hive';
import config from '@/env';
import * as wweb from '@utils/wweb';

const donation: Executor = async (client, message) => {
    const informationArray = [
        `Kamu bisa bantu perkembangan ${config.botName} dengan mentraktir creator ${config.botShortName} ke metode dibawah :`,
        `Trakteer : ${config.trakteerLink}`,
        `Rekening BCA : ${config.bankAccountInfo}`,
        `🙋‍♂️ : _"Semi Donasi apa itu ${config.botShortName} ?"_`,
        `🅰 : Jika kamu melakukan donasi ke link Trakteer, atau rekening bank diatas dengan nominal lebih dari Rp10.000, 80% dari nominal kamu akan creator donasikan kembali ke platform kitabisa.com / Dompet Dhuafa (dibulatkan kelipatan ribuan)\n`,
        `Fitur ini masih dalam tahap pengembangan, karena saat kamu melakukan donasi, ${config.botShortName} perlu melakukan feedback yang tepat untuk menangani donasi kamu. Tapi creator sudah mulai open donasi saat ini kok :)`
    ];
    wweb.replyMessage(message, informationArray.join('\n'));
}

export {
    donation
}