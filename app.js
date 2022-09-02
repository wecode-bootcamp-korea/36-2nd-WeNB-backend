const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./src/routes");
const { logger } = require("./src/logs/config/winston");
const {errorHandlerSync} = require("./src/utils/errorHandler")


const createApp = ()=>{
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(morgan('dev'));
    app.use((req,res,next)=>{
        logger.info(`request:${req.headers.host}${req.url}`)
        next();
    })
    app.use(routes);
    app.use(errorHandlerSync)
    return app;
}

module.exports= {
    createApp
}