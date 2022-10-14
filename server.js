const express = require("express");
const handlebars = require("express-handlebars")
const productosRouter = require("./routes/productos")
const app = express()

//Contenedor
const co = require("./script")
const conte = new co("productos.txt")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(8080, ()=>console.log("server is listening on port 8080"))

app.use("/productos", productosRouter)

//Ubico la carpeta o directorio donde ubico los templates .handlebars
app.set("views", "./views")

//Defino el motor para express
app.set("view engine", "pug")