import { Client, LocalAuth } from 'whatsapp-web.js'
import QR from 'qrcode-terminal'
import routeCommand from '@/command-router'
import config from '@/env'

let qrAttempts: number = 0;
const client: Client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    console.log('Scan this QR Code using your WhatsApp App');
    QR.generate(qr, {
        small: true
    });
    qrAttempts++;

    if (qrAttempts > 3) {
        console.log('Failed to generate QR Code. Exiting...');
        client.destroy()
    }
})

client.on('message', message => routeCommand(client, message))

client.on('loading_screen', async (_, message) => {
    console.log(`State:  ${message}`);
})

client.on('call', call => {
    call.reject();
})

client.on('ready', () => {
    console.log('System is online!');
})

client.on('disconnected', (message: string) => {
    console.log('Client is closed due to disconnecting', message);
})

console.log('==== WhatsApp Bot ====')
console.log('Initializing Bot Engine...')
console.log(`Bot name : ${config.botName}`)
console.log(`Bot short name : ${config.botShortName}`)
console.log(`Bot owner name : ${config.ownerName}`)
console.log(`Bot able to send reply : ${(config.isSendingMessageEnabled) ? 'Enabled' : 'Disabled'}`)
client.initialize();