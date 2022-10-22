const socketClient = io()

//------- Chat --------

//Se conectó un nuevo usuario
socketClient.on("newConnection", ()=>{
    if(email !== undefined){
        Swal.fire({
            title: "Se conectó un nuevo usuario",
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didDestroy : true
        })  
    }
})

//Se le solicita un email para la conexion
let email;
if(email === undefined){
    Swal.fire({
        title:"Bienvenido",
        text:"Ingresa tu email",
        input:"text",
        allowOutsideClick: false
    }).then(respuesta=>{
        email = respuesta.value   
        if(email === undefined || email === ""){
            window.location.reload()
        }
    })
}
// crea un nuevo objeto `Date`
var today = new Date();

//Funciones de enviar mensaje
let mensaje = document.getElementById("InpMensaje")
function enviarMensaje(){
    var fechaMensaje = today.toLocaleString();
    socketClient.emit("message", {
        email: email,
        mensaje: mensaje.value,
        fecha: fechaMensaje})
        mensaje.value = ""
}

mensaje.addEventListener("keydown", (ev)=>{
    if(ev.key === "Enter"){
        enviarMensaje()
    }
})

const botonEnv = document.getElementById("enviar")
botonEnv.addEventListener("click", enviarMensaje)

//Se insertan los mensajes mediante DOM en el html
const contMensajes = document.getElementById("contMensajes")
socketClient.on("historico",(data)=>{
    contMensajes.innerHTML = ""
    let elemento = ""
    data.forEach(item => {
        elemento = `<p id="mensaje"><span id="fecha">${item.fecha} </span> | <span id="email">${item.email}</span> - <span id="textMensaje">${item.mensaje}</span></p>` + elemento
    });
    contMensajes.innerHTML = elemento 
})

const agregarProducto = document.getElementById("agregarProducto")

agregarProducto.addEventListener("click",(ev)=>{
    let title = document.getElementById("title")
    let price = document.getElementById("price")
    let thumbnail = document.getElementById("thumbnail")
    console.log(title)
    let producto = {title:title.value,
                    price: price.value,
                    thumbnail:thumbnail.value}
    socketClient.emit("producto", producto)
})

socketClient.on("historicoProductos",(data)=>{
    const tablaProds = document.getElementById("tablaProds")
    let tabla = ""
    data.forEach(item =>{
        tabla = `<tr>
                    <td>${item.id}</td>
                    <td>${item.title}</td>
                    <td>${item.price}</td>
                    <td><img class="imagenProd" src=${item.thumbnail}/></td>
                </tr>` + tabla
    })
    tablaProds.innerHTML = `<tr>
                                <td>Id</td>
                                <td>Title</td>
                                <td>Price</td>
                                <td>Img</td>
                            </tr>` + tabla
})