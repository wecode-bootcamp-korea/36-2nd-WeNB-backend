const dotenv = require("dotenv");
dotenv.config();

const { createApp } = require("./app");
const { logger } = require("./src/logs/config/winston");

const startServer = async ()=>{
    try{
        const PORT = process.env.PORT
        const app = createApp();

        app.get("/ping", (req,res,next)=>{
            logger.info('GET /ping');
            res.status(200).json({message : "pong"});
        })

        app.listen(PORT, ()=>{
           logger.info(`listening on PORT : ${PORT}`)
        });
        } catch(err){
           logger.error(err)
        }
}

startServer();