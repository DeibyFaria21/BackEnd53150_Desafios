const fs = require('fs').promises

class ProductManager {
    constructor(filePath){
        this.products = []
        /* this.nextId = 1 */
        this.path = 'desafio3_EndPointsGets/src/products.json'
    }


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
}

module.exports = ProductManager