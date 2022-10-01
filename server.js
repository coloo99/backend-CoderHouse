const express = require("express")
const co = require("./script.js")

const conte = new co("productos.txt")
//creo servidor
const app = express()

//Configuro las rutas
app.get("/productos", async (request, response)=>{
    let productos = await conte.getAll()
    response.json(productos)
    console.log(productos)
})

app.get("/productoRandom", async (request, response)=>{
    let prodRandom = await conte.getRandomProduct()
    response.json(prodRandom)
})

//Levanto el servidor
app.listen(8080, ()=>{
    console.log("Andando en puerto 8080")
})