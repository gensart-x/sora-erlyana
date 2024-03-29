<p align="center">
    <img width="250" height="250" src="https://i.ibb.co/7y1v1q4/hour.png">
</p>

# SoraErlyana

![forthebadge](https://img.shields.io/github/last-commit/gensart-ai/whatsapp-bot/main?display_timestamp=author&style=for-the-badge&logo=github&link=https%3A%2F%2Fgithub.com%2Fgensart-ai%2Fwhatsapp-bot)

WhatsApp bot powered by Node.js, with several daily commands that might be useful for you

[![forthebadge](https://forthebadge.com/images/badges/powered-by-electricity.png)](https://web.pln.co.id/tentang-kami/profil-perusahaan)
[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)

# Preview

The preview might take a while to load sometimes, depends on your connection.

![preview of the bot](https://i.ibb.co/BKDnYQD/whatsapp-bot-preview.gif)

# Technology Used <!-- {docsify-ignore} -->

> This project still on maintaining 🚧, so it might have a massive changes, so stay tuned !

![forthebadge](https://img.shields.io/badge/Node.js-100000?style=for-the-badge&logo=node.js&logoColor=white&labelColor=60AA50&color=447C42)
![forthebadge](https://img.shields.io/badge/Typescript-100000?style=for-the-badge&logo=typescript&logoColor=white&labelColor=5094DD&color=5094DD)

# Features

Look at the documentation in the link down below ! Section `USAGE` !

# Overview

This application uses `whatsapp-web.js` as a primary library. Keep in mind if you want to use this app, you did already know that :

```bash
WhatsApp terms & conditions do not allow any unofficial bots or automation on its services.
And this app is considered unofficial.
```

So, I am not responsible for any banning happen to your WhatsApp account by using this app. **I strongly suggest** you to use this app with your new or backup WhatsApp number. I use my second number for this and still safe until now.

# Quickstart

The installation needs several steps, you might want to see the documentation for more information.

For quick installation, first thing you can clone the app, no matter what method you use, below is the simple example one :

```bash
git clone https://github.com/gensart-ai/whatsapp-bot.git
```

After that, you need to install the dependencies needed for the app, by doing :

```bash
npm i
```

And, since the app was developed in Typescript, you can build it by using command provided on `package.json` :

```bash
npm run build
```

Or you can run directly the Typescript (for development), by using `npm run dev`. FYI, I use `tsx` for running .ts files.

If you have done the step above, you should see some QR code in the terminal, that's the same QR when you use WhatsApp Web for authenticating. Scan the QR using your WhatsApp app.

Wait for a message `System is online!`, and voila ! You are successfully integrates your WhatsApp to the app !

Try to send `.help` to the WhatsApp you integrates in. It should return available commands as a response.

Current Stable Version : `1.1.0`  
Look more at the documentation ▶ : [here](https://gensart-ai.github.io/whatsapp-bot)
