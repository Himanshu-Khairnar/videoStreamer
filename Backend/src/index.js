import dotenv from 'dotenv'
import ConnectDB from './db/index.js'
import { app } from './app.js'
dotenv.config({
    path: './.env'
})



ConnectDB().then(() => {
    app.listen((process.env.PORT || 8000), () => {
        console.log("Server is running on port " + process.env.PORT || 8000)
    })
    app.on("error", (error) => console.log(error))
}).catch((error) => console.log(error))