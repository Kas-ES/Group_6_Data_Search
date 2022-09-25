import { Index } from './interfaces/Index';
export default class Server {
    private server;
    private indexes;
    constructor(indexes: Index[]);
    private setMiddleware;
    private setRoutes;
    private setIndexRoute;
    listen(port: number): Promise<void>;
}
