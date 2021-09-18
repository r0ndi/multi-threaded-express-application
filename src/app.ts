import Server from "./server";

const appConfig = {
    MULTI_THREADED: true,
    PORT: 8080,
};

new Server(appConfig.PORT, appConfig.MULTI_THREADED);
