import dotenv from 'dotenv'
import ConnectDB from './db/index.js'
dotenv.config({
path:'./env'
})

ConnectDB()

// import express from 'express'
// const app=express()
// ;( async()=>{
//     try {
//       await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//       app.on('error',(error)=>{
//         console.log(error)
//         throw error
//       })
//       app.listen(process.env.PORT,()=>{
//           console.log("App is listening on port "+process.env.PORT) 
//       })
//     } catch (error) {
//         console.log(error)
//         throw error
//     }
// })()