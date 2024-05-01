import express from 'express'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import productsRouter from './routes/products.router.js'
import { Server } from 'socket.io'
import { promises as fs } from 'fs';
import ProductManager from './productManager.js'


const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, () => console.log(`Server UP: Server running on port ${PORT}`));

const socketServer = new Server(httpServer)

const managerProducts = new ProductManager()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))
app.use('/realTimeProducts', viewsRouter)
app.use('/', productsRouter)


socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado");

    socket.on('message', data => {
        console.log(data);
    })

    managerProducts.getProducts()
    .then(products => {

        socketServer.emit('products', products)
        socketServer.emit('productsRealTime', products)
    })

    socket.on('addProduct', (data)=> {
        console.log("Recibiendo producto agregado");
        managerProducts.addProduct(data.title,data.description,data.code,data.price)
        .then(() => {
            console.log("Solicitando mostrar productos");
            managerProducts.getProducts()
            .then(products => {
                socketServer.emit('productsRealTime', products)
            })
        })

    })

    socket.on('deleteProduct', (data) => {
        managerProducts.deleteProduct(data)
        .then(() => {
            managerProducts.getProducts()
            .then((products) =>{
                socketServer.emit('productsRealTime', products)
            })
        })
    })
})