import { Client, Message } from 'whatsapp-web.js';

/**
 * Middleware for incoming message request  
 * Needs to return boolean, either true (continue) or false (stop there)
 */
type Middleware = (client: Client, message: Message) => Promise<boolean>

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
     * @return Boolean whether the execution should continue or not
     */
    async emit(client: Client, message: Message): Promise<boolean> {
        if (this.events.length == 0) return true;

        for(const middleware of this.events) {
            const isRequestDenied = await middleware(client, message) == false;

            if (isRequestDenied) return false;
        }
        return true;
    }
}

export {
    CommandMiddleware, Middleware
}