const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const DotEnv = require('dotenv')
const Port = process.env.PORT || 9000
const Database = require('./db/db')
// const authRoute = require('./authRoute/authRoute')
const apiRoute = require('./apiRoute/apiRoute')
const check = require('./middleware/block')

// This works locally only, and is ignored on Vercel
if (process.env.NODE_ENV === 'development') {
  DotEnv.config({ path: ['.env.local', '.env'] });
} else {
  DotEnv.config();
}

Database()

const app = express()

app.use(cors())
app.use(bodyparser.json())

app.use('/api',check,apiRoute)

app.get('/',async(req,res)=>{
    res.send('i am connected!')
})

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
    
})