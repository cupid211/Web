const http = require("http")
const fs = require ("fs")// работа с файлами
const path = require ("path")// для работы с путями



const port = process.env.port || 3000

// создание сервера
const server = http.createServer ((req, res)=>{
    let filePath = path.join(__dirname, req.url==='/' ? 'index.html' : req.url)
    const ext=path.extname(filePath)// проверка расширения
    let contentType = null
    switch(ext)
    {
        case '.css': 
            contentType = 'text/css'
            break
        case '.js': 
            contentType = 'text/javascript'
            break
        default:
            contentType = 'text/html'
            break
    }
    if(!ext)
    {
        filePath+='.html'
    }
    console.log(filePath)
    fs.readFile(filePath,(err,data)=>
    {
        if(err)
        {
            res.writeHead(500)
            res.end('Error')
        }
        else
        {
            res.writeHead(200,{'Content-Type':contentType})
            res.end(data)
        }
    })
}) 

server.listen(port,()=>{
    console.log('Server has been started...')
})


