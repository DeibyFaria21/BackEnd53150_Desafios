//Importaciones
/* import express, { urlencoded, json } from "express" */
import express from "express";
import mongoose from "mongoose";
import {__dirname} from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import methodOverride from 'method-override';
import passport from "passport";
import initializePassport from './config/passport.config.js'


import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"

import productsRouterdb from "./routes/products.router.db.js"
import cartsRouterdb from "./routes/carts.router.db.js"
import messagesRouterdb from "./routes/messages.router.db.js"
import usersRouter from "./routes/users.router.db.js"
import viewsRouter from "./routes/views.router.db.js"

import productModel from './dao/models/product.model.js'
import messageModel from "./dao/models/message.model.js"


//Configuración del server
const app = express()
const PORT = 8080



//Declaración de midlewares
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'))

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb+srv://DeibyFaria21:Simple123@cluster0.fc7im6z.mongodb.net/ecomerce?retryWrites=true&w=majority&appName=Cluster0" }),
}));

//Middleware que permite usar el metodo DELETE /carts/ID/product/ID...
//...en un boton dentro del handlebars de cartDetail.
app.use(methodOverride('_method'));

//Middleware de passport e instanciacion
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


//Declaración de endpoints fs
app.use("/fs/products", productsRouter)
app.use("/fs/carts", cartsRouter)

//Declaración de endpoints db
app.use("/api", productsRouterdb)
app.use("/api", cartsRouterdb)
app.use("/api", messagesRouterdb)
app.use("/api/sessions", usersRouter)
app.use("/", viewsRouter)


dotenv.config()
console.log(process.env.MONGO_URL)


mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Conectado a la base de datos")
    })
    .catch(error => console.error("Error en la conexión", error))


//TESTEO DE VELOCIDAD DE RESPUESTA DE LA "DB"
//Dentro del find se coloca un campo a buscar y un valor
//Para que no busque en todos los campos se hace la indexación
//En el modelo (Schema), se debe colocar otra propiedad "index: true"
/* const enviroment = async () => {
    await mongoose.connect(process.env.MONGO_URL)
    let response = await xxxModel.find({first_name: "xxx"}).explain("executionStats")
    console.log(response)
} */


//Instanciando el listener del puerto
/* app.listen(PORT, () => {
    console.log(`Server UP: Server running on port ${PORT}`)
}) */


//Instanciando el listener del puerto y el SocketServer
const httpServer = app.listen(PORT, () => console.log(`Server UP: Server running on port ${PORT}`));
const socketServer = new Server(httpServer)



socketServer.on('connection', async (socket)=>{
    console.log('Nuevo cliente conectado', socket.id);

    productModel.find().lean().then(products => {
        socket.emit('products', products);
    });

    socket.on('enviarNuevoProducto', async (product) => {
        try {
            await productModel.create(JSON.parse(product));
            const updatedProducts = await productModel.find().lean();
            io.emit('products', updatedProducts);
        } catch (error) {
            console.error('Error al crear el producto:', error);
        }
    });

    socket.on('addMessage', async (data) => {
        console.log('Recibiendo mensaje');
        const { user, message } = data;
        await messageModel.create({ user, message });
        console.log('Mostrando mensaje');
        const messages = await messageModel.find().lean();
        socketServer.emit('messagesRealTime', messages);
    });

    /* socket.on('addMessage', (data)=> {
        console.log("Recibiendo mensaje");
        const {user, message} = data;
        messageModel.create({user, message})
        .then(() => {
            console.log("Mostrando mensaje");
            messageModel.find()
            .then(messages => {
                socketServer.emit('messagesRealTime', messages)
            })
        })
    }) */
})