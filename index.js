const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const DotEnv = require('dotenv')
const Port = process.env.PORT || 9000
const Database = require('./db/db')
// const authRoute = require('./authRoute/authRoute')
const apiRoute = require('./apiRoute/apiRoute')
// const userRoute = require('./userdataRoute/userdataRoute')
// const check = require('./middleware/block')



const app = express()

// This works locally only, and is ignored on Vercel
if (process.env.NODE_ENV === 'development') {
  DotEnv.config({ path: ['.env.local', '.env'] });
} else {
  DotEnv.config();
}


Database()

app.use(cors())
app.use(bodyparser.json())

app.use('/api',apiRoute)


app.get('/',async(req,res)=>{
    res.send('i am connected!')
})

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
})