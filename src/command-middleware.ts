import { CommandMiddleware, Middleware } from '@utils/middleware';

const middleware = new CommandMiddleware()

// Adding some random delay, max. 1500ms
middleware.use(async (_, __, next) => {
    await new Promise(resolve => setTimeout(resolve, [0, 1500][Math.round(Math.random())]))
    next()
})

// The bot will only listen to text/chat or image with text messages, otherwise ignore it
middleware.use((_, message, next) => {
    const type: string = message.type;
    if (['chat', 'image', 'video'].includes(type) != false) {
        next()
    }
})

// If the message is coming from group, ignore it.
middleware.use(async (_, message, next) => {
    if((await message.getChat()).isGroup == false) {
        next()
    }
})

export default middleware