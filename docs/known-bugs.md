# Known Bugs on SoraErlyana

## Video/GIF/similar format processing
I've tried some features like Image to Sticker, when I send some media like video or GIFs, it can't process the request correctly.

I've been searched why and how, and I forgot wwebjs.dev library clearly says on this [page](https://wwebjs.dev/guide/creating-your-bot/handling-attachments.html#caveat-for-sending-videos-and-gifs) 🤣.

The solution I think is you need to port your own Chrome installation path to whatsapp-web.js library, which the detail you can find on the page link above.

I haven't implemented this because I still use some free server to host this app, and the server can't provide full fat browser instance to support this.