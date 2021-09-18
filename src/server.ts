import express, {Application, request, Request, Response} from "express";

class Server {
    private readonly app: Application;

    constructor() {
        this.app = express();

        this.setUpRoutes();
    }

    public listen = (port: number): void => {
        this.app.listen(port, () => {
            console.log(`Started server on => http://localhost:${port} for process ID ${process.pid}`);
        });
    }

    private setUpRoutes = (): void => {
        this.app.get("/example", (request: Request, response: Response) => {
            response.send(`Example response for process ID ${process.pid}`);
        })
    }
}

export default Server;
