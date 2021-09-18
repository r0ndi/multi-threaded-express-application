import express, {Application, Request, Response} from "express";
import cluster, { Worker } from "cluster";
import os from "os";

class Server {
    private workers: Worker[] = [];

    private readonly app!: Application;
    private readonly port: number;

    constructor(port: number, multiThreaded: boolean = false) {
        this.app = express();
        this.port = port;

        if (multiThreaded && cluster.isMaster) {
            this.setUpWorkerProcesses();
        } else {
            this.setUpRoutes();
            this.listen();
        }
    }

    private listen = (): void => {
        this.app.listen(this.port, () => {
            console.log(`Started server on => http://localhost:${this.port} for process ID ${process.pid}`);
        });
    }

    private setUpRoutes = (): void => {
        const exampleAsyncMethod = async () => {
            return new Promise((resolve): void => {
                setTimeout(() => {
                    resolve(`Example operation for process ID: ${process.pid}`);
                }, 10000);
            });
        };

        this.app.get("/example", async (request: Request, response: Response): Promise<void> => {
            response.send(await exampleAsyncMethod());
        })
    }

    private setUpWorkerProcesses = (): void => {
        for (let index = 0; index < os.cpus().length; index++) {
            this.workers.push(cluster.fork());
            this.workers[index].on("message", (message: string): void => {
                console.log(message);
            });
        }

        cluster.on("online", (worker: Worker): void => {
            console.log(`Worker ${worker.process.pid} is listening`);
        });

        cluster.on("exit", (worker: Worker, code: number, signal: string): void => {
            this.workers.push(cluster.fork());
            this.workers[this.workers.length - 1].on("message", (message: string) => {
                console.log(message);
            });
        });
    }
}

export default Server;
