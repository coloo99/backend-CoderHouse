const express = require("express");
const fs = require("fs");
const {Server} = require("socket.io")
const handlebars = require("express-handlebars")
const productosRouter = require("./routes/productos")
const PORT = process.env.PORT || 8080

//Creo servidor
const app = express()

//Donde cargar archivos publicos
app.use(express.static(__dirname+"/public"))

//Contenedor de las funciones para los productos
const co = require("./script")
const conte = new co("./data/productos.txt")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Que puerto escucha el servidor
const server = app.listen(PORT, ()=>console.log(`server is listening on port ${PORT}`));

//Servidor del web socket conectado al server de express
const io = new Server(server);

//Rutas de productos
app.use("/productos", productosRouter)

//Defino el motor de plantillas
app.engine("handlebars",handlebars.engine())

//Ubico la carpeta o directorio donde ubico los templates .handlebars
app.set("views", "./views")

//Defino el motor para express
app.set("view engine", "handlebars")

//Utilizando Websocket
let historialMensajes
if(fs.readFileSync("./data/mensajes.txt")){
    historialMensajes = []
}else{
    historialMensajes = JSON.parse(fs.readFileSync("./data/mensajes.txt"));
}
io.on("connection", async (socket)=>{
    console.log("Nuevo usuario conectado ", socket.id)
    socket.broadcast.emit("newConnection")
    socket.on("message", data=>{
        historialMensajes.push(data)
        try{
            fs.writeFileSync("./data/mensajes.txt", JSON.stringify(historialMensajes))
        }catch(err){
            console.log(err)
        }
        //Para todos los sockets conectados
        let historialChat = fs.readFileSync("./data/mensajes.txt")
        io.sockets.emit("historico", JSON.parse(historialChat))
    })
    let historialChat = fs.readFileSync("./data/mensajes.txt")
    io.sockets.emit("historico", JSON.parse(historialChat))
    let historialProductos = await conte.getAll()
    io.sockets.emit("historicoProductos", historialProductos)
    socket.on("producto",async data=>{
        await conte.save(data)
        historialProductos = await conte.getAll()
        io.sockets.emit("historicoProductos", historialProductos)
    })
})