# Requirements

## TL;DR <!-- {docsify-ignore} -->

You need :

- Node.js v18++
- NPM installed on your device
- [ffmpeg](https://ffmpeg.org/) (Windows users may need this) - For multimedia support
- ImgBB API Key, learn more at [https://api.imgbb.com/](https://api.imgbb.com/). Its usage is for Image-To-Sticker Text module
- Ghola API, learn more at [https://www.ghola.ai/developer](https://www.ghola.ai/developer). You may need to signup/login using Google account first. Its usage is for AI Text Generation

## Long to short <!-- {docsify-ignore} -->

This project requires **Node.js** to run, I use **Node v20.10** on Windows 10 and **Debian 11** too and it works fine. I haven't tested it yet on different version or environment than mine, but you may try it and report it to me, so I can update this details by you :).  
You can use this [link](https://nodejs.org/en) to go to Node.js homepage for installation or more details.

Oh also, make sure you have installed **NPM** too. Usually **Node.js** includes **NPM** so you don't need to install it again.

And i often experience errors when testing multimedia with this app on Windows 10 environment, but not on Debian 11. My assumption going to **ffmpeg** problem, maybe you can install that if you experience an error when dealing with multimedia thing.

You also need ImgBB for multimedia thing in current built-in features. Soon maybe I'll explain more why I use this, and maybe doing removal on need of ImgBB if possible. See [here](https://api.imgbb.com/) for more information.

Ghola API key is needed for built-in feature : AI with `.tanya` command. It hits Ghola's AI API. See [here](https://www.ghola.ai/developer) for more information.

## **🔴 IMPORTANT NOTICE 🔴** <!-- {docsify-ignore} -->

This project greatly having use of [whatsapp-web.js](https://wwebjs.dev/), and maybe **if you are running on a `no-gui` Linux image (Server, or Linux OS that did not installed GUI system)**, you may need to see and follow this page first : [Click Me](https://wwebjs.dev/guide/#installation-on-no-gui-systems)
