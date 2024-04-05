const ProductManager = require('./productManager.js')

const manager = new ProductManager('./products.json')


manager.getProducts()
    .then(temporalProducts => console.log('Productos en Array', temporalProducts))
    .catch(error => console.error("Error al consultar productos", error))


manager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
})

manager.addProduct({
    title: "Teclado Mecanico Logitech",
    description: "Teclado mecanico G935 con switches tactic",
    price: 90.95,
    thumbnail: "Imagenes/TecladoLogitechG935.png",
    code: "LOG935",
    stock: 7
})

manager.addProduct({
    title: "Teclado de Membrana Sentey",
    description: "Teclado de membrana Acrylix con RGB y macros",
    price: 20.23,
    thumbnail: "Imagenes/TecladoSenteyAcrylix.png",
    code: "STY401",
    stock: 13
})

manager.addProduct({
    title: "MISMO CODIGO DE PRODUCTO",
    description: "Teclado mecanico G935 con switches tactic",
    price: 90.95,
    thumbnail: "Imagenes/TecladoLogitechG935.png",
    code: "LOG935",
    stock: 7
})


manager.getProducts()
    .then(temporalProducts => console.log('Productos en Array', temporalProducts))
    .catch(error => console.error("Error al consultar productos", error))


async function buscadorDeProductoPorId(id){
    const searchProduct = await manager.getProductById(id)
    console.log(searchProduct)
}
buscadorDeProductoPorId(2)


const newSpecProduct = {
    title: "Teclado de Mecamembrana HyperX",
    description: "Teclado de mecamembrana Skynet con macros y multimedia",
    price: 77.77,
    thumbnail: "Imagenes/TecladoHyperXSkynet.png",
    code: "XYX701",
    stock: 69,
    id: 3
}

async function modificarProducto(id){
    await manager.updateProduct(id, newSpecProduct)
    console.log(newSpecProduct)
}
modificarProducto(3)



async function eliminarProducto(id){
    await manager.deleteProduct(id)
}
eliminarProducto(2)


manager.getProducts()
    .then(temporalProducts => console.log('Productos en Array', temporalProducts))
    .catch(error => console.error("Error al consultar productos", error))