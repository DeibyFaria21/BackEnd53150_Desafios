import { promises as fs } from 'fs';

const path = './desafio4_HandlebarsWebsockets/products.json'

class ProductManager  {
    constructor(){
        this.path = path
    }

    async addProduct(title, description, code, price) {
        try {
            const products = await this.getProducts();
            const product_id = products.length + 1;
            const findProduct = products.find((product) => product.id === product_id);

            if (!findProduct) {
                const prod = {
                    id: product_id,
                    title,
                    description,
                    code,
                    price
                }
                products.push(prod);
                await fs.writeFile(this.path, JSON.stringify(products, null, 2))
            } else {
                console.log("Error: el producto ya existe")
            }
        } catch (error) {
            console.error("Error al crear el producto", error);
        }
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8')
            return JSON.parse(data)
        } catch (error) {
            if (error.code === 'ENOENT') {
                return []
            } else {
                throw error
            }
        }
    }

    async deleteProduct(idProduct) {
        try {
            const products = await this.getProducts()
            console.log(idProduct);
            const findProduct = products.find((product) => product.id === idProduct)

            if (!findProduct) {
                console.log("Error ID no encontrado")
            }else{
                products.pop(findProduct);
                const productsUpdate = JSON.stringify(products, null, 2)
                await fs.writeFile(this.path, productsUpdate)
                console.log("Producto borrado con exito")
            }
        } catch (error) {
            console.error("Error: El producto no se pudo borrar", error);
        }
    }
}

export default ProductManager