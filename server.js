const dotenv = require("dotenv");
dotenv.config();

const { createApp } = require("./app");
const { logger } = require("./src/logs/config/winston");
const { appDataSource } = require("./src/models/datasource");

const startServer = async ()=>{
    try{
        const PORT = process.env.PORT
        const app = createApp();

        appDataSource
        .initialize()
        .then(() => {
          console.log("Data Source has been initialized!");
        })
        .catch((err) => {
          console.error("Error occurred during Data Source initialization", err);
          appDataSource.destroy();
        });

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