const express = require('express')
const dotenv = require('dotenv')
const Redis = require('ioredis')
const rateLimit = require('express-rate-limit')


dotenv.config()
const app = express();


const redis = new Redis();
app.use(express.json())



const rateLimiter = async (req, res , next)  => {
    const userIp = req.ip;
    const requestLimit = 5
    const windowSeconds = 60 ;

    try {
        const requests = await redis.incr(userIp)

        if(requests == 1) {
            await redis.expire(userIp , windowSeconds)
        }

        if(requests > requestLimit) {
            res.status(429).json({message : "Tooo Many Request Boss"})
        }
        
        next();
    } catch (error) {
        console.log(500).json({message : "Eroor"})
        
    }

}


app.use('/api' , rateLimiter)

app.get('/api/test' , (req, res) => {
    res.json({message : "Request Succesfull"})
})

app.listen(5000 , () => {
    console.log("Server Running on Port 5000")
})