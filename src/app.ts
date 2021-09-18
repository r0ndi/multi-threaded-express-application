import Server from "./server";

const appConfig = {
    PORT: 8000,
};

const server = new Server();
server.listen(appConfig.PORT);