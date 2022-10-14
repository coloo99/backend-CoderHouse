const express = require("express");
const handlebars = require("express-handlebars")
const productosRouter = require("./routes/productos")
const app = express()

//Donde cargar archivos estaticos
app.use(express.static('public'))

//Contenedor
const co = require("./script")
const conte = new co("productos.txt")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(8080, ()=>console.log("server is listening on port 8080"))

app.use("/productos", productosRouter)

//Defino el motor de plantillas
app.engine("handlebars",handlebars.engine())

//Ubico la carpeta o directorio donde ubico los templates .handlebars
app.set("views", "./views")

//Defino el motor para express
app.set("view engine", "handlebars")

//Ruta para mostrar los productos en una tabla
app.get("/mostrarProductos", async (request, response)=>{
    const productos = await conte.getAll();
    response.render("mostrarProductos", {productos})
})

//Ruta con formulario para agregar los productos mediante post
app.get("/agregarProductos", async (request, response)=>{
    const productos = await conte.getAll();
    response.render("agregarProductos", {productos})
})

//Post de los productos
app.post("/", async (request, response)=>{
    const newProducto = request.body
    console.log(newProducto)
    const productoAgregado = await conte.save(newProducto)
    response.redirect("/mostrarProductos")
})