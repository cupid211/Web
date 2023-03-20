const express = require ('express')
const mongoose =require('mongoose')
const path = require('path')
const exphbs = require ('express-handlebars')
const app = express()
const auth_registr = require('./routes/auth_routes')

const port = process.env.port || 3000

const hbs = exphbs.create({
    defaultLayout:'main',
    extname:'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(auth_registr)

async function start (){
    try{
        // await mongoose.connect('mongodb://Polina:21112001@localhost:27017/?authMechanism=DEFAULT&authSource=admin', {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // })
        app.listen(port,()=>{
            console.log('Server has been started...')
        })
    }
    catch(e)
    {
        console.log(e)
    }
}

start()