const fs = require("fs");

class Contenedor{
    constructor(nameFile){
        this.nameFile = nameFile;
    }

    save = async(product)=>{
        try {
            //leer el archivo existe
            let newProduct = {}
            if(fs.existsSync(this.nameFile)){
                const contenido = await fs.promises.readFile(this.nameFile,"utf8");
                if(contenido){
                    const productos = JSON.parse(contenido);
                    const lastIdAdded = productos.reduce((acc,item)=>item.id > acc ? acc = item.id : acc, 0);
                    newProduct={
                        id: lastIdAdded+1,
                        ...product
                    }
                    productos.push(newProduct);
                    await fs.promises.writeFile(this.nameFile, JSON.stringify(productos, null, 2))
                } else{
                    //si no existe ningun contenido en el archivo
                    newProduct={
                        id:1,
                        ...product
                    }
                    //creamos el archivo
                    await fs.promises.writeFile(this.nameFile, JSON.stringify([newProduct], null, 2));
                }
            } else{
                // si el archivo no existe
                newProduct={
                    id:1,
                    ...product
                }
                //creamos el archivo
                await fs.promises.writeFile(this.nameFile, JSON.stringify([newProduct], null, 2));
            }
            return newProduct
        } catch (error) {
            console.log(error);
        }
    }

    getById = async(id)=>{
        try {
            if(fs.existsSync(this.nameFile)){
                const contenido = await fs.promises.readFile(this.nameFile,"utf8");
                if(contenido){
                    const productos = JSON.parse(contenido);
                    const producto = productos.find(item=>item.id===id);
                    return producto
                } else{
                    return "El archivo esta vacio"
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    getAll = async()=>{
        try {
            const contenido = await fs.promises.readFile(this.nameFile,"utf8");
            const productos = JSON.parse(contenido);
            return productos
        } catch (error) {
            console.log(error)
        }
    }

    deleteById = async(id)=>{
        try {
            const contenido = await fs.promises.readFile(this.nameFile,"utf8");
            const productos = JSON.parse(contenido);
            const newProducts = productos.filter(item=>item.id!==id);
            await fs.promises.writeFile(this.nameFile, JSON.stringify(newProducts, null, 2));
        } catch (error) {
            console.log(error)
        }
    }

    deleteAll = async()=>{
        try {
            await fs.promises.writeFile(this.nameFile, JSON.stringify([]));
        } catch (error) {
            console.log(error)
        }
    }
    getRandomProduct = async()=>{
        let productos = await this.getAll()
        let NumRand = parseInt(Math.random()*productos.length)
       
        return productos[NumRand]
    }
}

const listaProductos = new Contenedor("./productos.txt")
const producto1 = {
    title:"mayonesa",
    price:200,
    thumbnail:"https://f.fcdn.app/imgs/a9fa89/www.elclon.com.uy/clonuy/ce5d/original/catalogo/83745-1/460_460/mayonesa-uruguay-d-p-500cc-mayonesa-uruguay-d-p-500cc.jpg"
}

const producto2 = {
    title:"leche",
    price:90,
    thumbnail:"https://geant.vteximg.com.br/arquivos/ids/251828-1000-1000/240501.jpg?v=637272144698570000"
}

const producto3 = {
    title:"arroz",
    price:70,
    thumbnail:"https://www.saman.uy/wp-content/uploads/2021/07/DonRuggero1KgProducto.png"
}

/* const crearProducto = async()=>{
    await listaProductos.save(producto1);
    await listaProductos.save(producto2);
    await listaProductos.save(producto3);
    const resultadoId = await listaProductos.getById(2);
    console.log(resultadoId)
    const productos = await listaProductos.getAll();
    console.log(productos)
    await listaProductos.deleteById(3);
    await listaProductos.save(producto3);
    // await listaProductos.deleteAll();
} */

/* crearProducto(); */

module.exports = Contenedor