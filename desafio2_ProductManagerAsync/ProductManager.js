const fs = require('fs').promises

class ProductManager {
    constructor(filePath){
        this.products = []
        this.nextId = 1
        this.path = filePath
    }
    
        
    async addProduct(product) {
        
        if(!this.isProductValid(product)){
            console.log("Error: El producto no cumple los requisitos")
            return
        }
        
        if(this.isCodeDuplicate(product.code)){
            console.log("Error: El código del producto ya esta registrado")
            return
        }
        
        product.id = this.nextId++
        this.products.push(product)
        
        await this.reloadProducts(this.products)
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

    async getProducts(){
        try {
            let temporalProducts = await this.loadProducts()
            return temporalProducts
        } catch (error) {
            console.error("Error al consultar los productos", error)
            return []
        }
    }

    async getProductById(id){
        try {
            const temporalArray = await this.loadProducts()
            const product = temporalArray.find((p) => p.id === id)
            if(product){
                console.log("Producto buscado por ID:")
                return product
            } else {
                console.log("Error: Producto no encontrado")
            }
        } catch {
            console.log("Error al leer el listado de productos")
        }
    }

    async loadProducts() {
        try {
            const saveProducts = await fs.readFile(this.path, 'utf8')
            const saveProductsArray = JSON.parse(saveProducts)
            return saveProductsArray
        } catch (error) {
            console.log("Error al leer listado de productos")
        }
    }

    async reloadProducts(saveProductsArray) {
        try {
            await fs.writeFile(this.path, JSON.stringify(saveProductsArray, null, 2))
            console.log("Producto cargado correctamente")
        } catch (error) {
            console.error("Error al cargar el producto", error)
        }
    }

    async updateProduct(id, productChange){
        try {
            const saveProductsArray = await this.loadProducts()

            const position = saveProductsArray.findIndex(item => item.id === id)
            if(position !== -1){
                saveProductsArray.splice(position, 1, productChange)
                await this.reloadProducts(saveProductsArray)
            }else{
                console.log('Producto a actualizar no se encontro')
            }
        } catch (error) {
            console.log('El producto no se pudo actualizar', error)
        }
    }

    async deleteProduct(id){
        try {
            const saveProductsArray = await this.loadProducts()
            const eraseProduct = saveProductsArray.filter(item => item.id != id)
            await this.reloadProducts(eraseProduct)
        } catch (error) {
            console.log('No se puede borrar el producto')
        }
    }
}


module.exports = ProductManager