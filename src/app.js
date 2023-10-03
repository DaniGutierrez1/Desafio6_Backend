import express from "express";
import { config } from "./config/config.js";
import { connectDB } from "./config/dbConnection.js";

import session from "express-session";
import MongoStore from "connect-mongo";

import {engine} from "express-handlebars";
import { __dirname } from "./utils.js";
import path from "path";
import { Server} from "socket.io"

import {initializePassport} from "./config/passportConfig.js"
import passport from "passport"


import { viewsRouter } from "./routes/views.routes.js";

import { sessionsRouter } from "./routes/sessions.routes.js";
import { productsRouter } from "./routes/products.routes.js";
// import { cartsRouter } from "./routes/cart.routes.js";



const port = config.server.port;
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    store:MongoStore.create({
        mongoUrl:config.mongo.url
    }),
    secret:config.server.secretSession,
    resave:true,
    saveUninitialized:true
})); 

const httpServer=app.listen(port,()=> console.log(`server escuchando en puerto ${port}`));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname,"/public")))

app.use("/api/products", productsRouter);
app.use("/api/sessions", sessionsRouter);
//app.use("/api/carts", cartsRouter);

//Handlebars
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"./views"));

const socketServer = new Server(httpServer)

let productos=[];

socketServer.on("connection",(socketConnected)=>{
    console.log(`Bienvenido ${socketConnected.id}`)


    socketConnected.on("creacionTitulo",(data)=>{
        console.log(data);
        productos.push({producto:data});

        socketServer.emit("historialProductos",productos);
        
    })

});


app.use(viewsRouter);

