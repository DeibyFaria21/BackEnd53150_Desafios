const fs = require('fs/promises')

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