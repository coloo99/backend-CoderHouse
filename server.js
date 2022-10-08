const express = require("express");
const productosRouter = require("./routes/productos")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(8080, ()=>console.log("server is listening on port 8080"))

app.use("/productos", productosRouter)