class ProductManager {
    constructor(){
        this.products = []
        this.nextId = 1
    }

    addProduct(product){
        if(!this.isProductValid(product)){
            console.log("Error: El producto no cumple los requisitos")
            return
        }

        if(this.isCodeDuplicate(product.code)){
            console.log("Error: El código del producto ya esta registrado")
            return
        }

        product.id= this.nextId++
        this.products.push(product)
    }

    getProducts(){
        return this.products
    }

    getProductById(id){
        const product = this.products.find((p) => p.id === id)
        if(product){
            return product
        } else {
            console.log("Error: Producto no existe")
        }
    }

    isProductValid(product){
        return(
            product.title &&
            product.description &&
            product.price &&
            product.thumbnail &&
            product.code &&
            product.stock !== undefined
        )
    }

    isCodeDuplicate(code){
        return this.products.some((p)=> p.code === code)
    }
}


const productManager = new ProductManager()
const productos = productManager.getProducts()



console.log(productos)
console.log("Acá arriba se encuentra el array vacío...")



productManager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
})
productManager.addProduct({
    title: "Teclado Mecanico Logitech",
    description: "Teclado mecanico G935 con switches tactic",
    price: 90.95,
    thumbnail: "Imagenes/TecladoLogitechG935.png",
    code: "LOG935",
    stock: 5
})
productManager.addProduct({
    title: "Teclado de Membrana Sentey",
    description: "Teclado de membrana Acrylix con RGB y macros",
    price: 20.23,
    thumbnail: "Imagenes/TecladoSenteyAcrylix.png",
    code: "STY401",
    stock: 5
})


console.log(productos)


productManager.addProduct({
    title: "producto prueba mismo CODE",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
})
productManager.addProduct({
    title: "producto sin todos los campos",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "",
    code: "",
    stock: 25
})



console.log("Definidos los ID, buscaremos uno en especifico a continuación")
const productoEspecifico = productManager.getProductById(2)
console.log(productoEspecifico)

console.log("Y ahora un ID inexistente en el array...")
const productoEspecifico2 = productManager.getProductById(7)
console.log(productoEspecifico2)