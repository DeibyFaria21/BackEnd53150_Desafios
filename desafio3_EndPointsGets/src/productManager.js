const fs = require('fs').promises

class ProductManager {
    constructor(filePath){
        this.products = []
        /* this.nextId = 1 */
        this.path = 'desafio3_EndPointsGets/src/products.json'
    }
    
        
    /* async addProduct(product) {
        
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

    } */
    
    /* isProductValid(product){
        return(
            product.title &&
            product.description &&
            product.price &&
            product.thumbnail &&
            product.code &&
            product.stock !== undefined
        )
    } */

    /* isCodeDuplicate(code){
        return this.products.some((p)=> p.code === code)
    } */

    async getProducts(){
        try {
          const data = await fs.readFile(this.path, 'utf-8')
          const productsJson = JSON.parse(data)
          console.log('Archivo de productos leído correctamente')
          return productsJson
        } catch (error) {
          console.log('ERROR: Archivo de productos no leído')
          throw error
        }
    }
    async getProductById(id){
        try {
            const data = await fs.readFile(this.path, 'utf-8')
            const productsJson = JSON.parse(data)
            const product = productsJson.find((product) => product.id === id)
    
            if (!product) {
                const error = 'Producto especificado no existe'
                console.log(error)
                return error
            }
            console.log('Producto especificado encontrado correctamente:', product)
            return product
            } catch (error) {
            console.log('ERROR: Archivo de producto especificado no leído')
            throw error
        }
    }

    /* async updateProduct(id, productChange){
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
    } */

    /* async deleteProduct(id){
        try {
            const saveProductsArray = await this.loadProducts()
            const eraseProduct = saveProductsArray.filter(item => item.id != id)
            await this.reloadProducts(eraseProduct)
        } catch (error) {
            console.log('No se puede borrar el producto')
        }
    } */
}


module.exports = ProductManager