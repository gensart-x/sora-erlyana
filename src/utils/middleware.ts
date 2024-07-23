import { Client, Message } from 'whatsapp-web.js';

type Middleware = (client: Client, message: Message, next: () => void) => void

class CommandMiddleware {
    events: Array<Middleware>

    constructor() {
        this.events = []
    }

    /**
     * Register a middleware  
     *   
     * You are able to stop the execution in the middleware  
     * By not calling the next function in the end of the middleware  
     *   
     * How this middleware works may similar with Express Middleware
     * @param middleware The middleware for the message
     */
    use(middleware: Middleware) {
        this.events.push(middleware)
    }

    /**
     * Emits all registered middlewares
     * @param client the client of whatsappwebjs instance
     * @param message the message instance of whatsappwebjs instance
     * @returns void
     */
    emit(client: Client, message: Message) {

        if(this.events.length == 0) return 0;

        const next = (i: number) => {
            if (i < this.events.length) {
                this.events[i](client, message, () => next(i + 1))
            }
        }

        next(0)
    }
}

export {
    CommandMiddleware, Middleware
}