//Importaciones
import { promises as fs } from 'fs'


//Contruyendo la clase y los métodos utilizables para los productos
class ProductManager {
  constructor(filePath){
    this.products = []
    this.productIdCounter = 1
    this.path = 'products.json'
  }


  //Metdo para agregar producto
  async addProduct(title, description, code, price, status, stock, category, thumbnail) {
    if (!title || !description || !code || !price ||  !status || !stock || !category || !thumbnail) {
      const error = 'Error: Todos los campos son obligatorios'
      console.log(error)
      return error
    }
    const productsList = await this.getProducts()
    const existProduct = productsList.findIndex((product) => product.code === code)
    if (existProduct !== -1) {
      const error = 'Error: Ya existe un producto con ese código'
      console.log(error)
      return error
    }
    const newProduct = {
      id: productsList?.length+1,
      title: title,
      description: description,
      code: code,
      price: price,
      status: status,
      stock: stock,
      category: category,
      thumbnail: thumbnail,
    };
    this.products.push(newProduct)
    this.jsonWriteProducts()
    return newProduct
  }


  //Metodo para leer y agregar productos al archivo products.json
  async jsonWriteProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      const products = JSON.parse(data);
      
      if (!products.length) {
        this.productIdCounter++;
      } else {
        products.push(...this.products);
      }
      
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
      console.log('Productos escritos en el archivo correctamente');
    } catch (error) {
      console.error('Error al escribir en el archivo:', error);
    }
  }


  //Metodo para obtener el listado de productos en products.json
  async getProducts() {
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


  //Metodo para obtener un producto especifico del listado de productos en products.json
  async getProductById(id){
    try {
        const data = await fs.readFile(this.path, 'utf-8')
        const productsJson = JSON.parse(data)
        const product = productsJson.find((product) => product.id === id)

        if (!product) {
            const error = 'Producto especificado no existe'
            console.log(error)
            return /* error */
        }
        console.log('Producto especificado encontrado correctamente:', product)
        return product
        } catch (error) {
        console.log('ERROR: Archivo de producto especificado no leído')
        throw error
    }
  }


  //Metodo para actualizar las propiedades de un producto especifico del listado de productos en products.json
  async updateProduct(id, updatedFields) {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      const productsJson = JSON.parse(data);
      
      const productIndex = productsJson.findIndex((product) => product.id === id);
      if (productIndex === -1) {
        const error = 'Producto para actualizar no encontrado';
        console.log(error);
        return error;
      }
  
      const updatedProduct = { ...productsJson[productIndex], ...updatedFields };
      productsJson[productIndex] = updatedProduct;
  
      await this.saveProducts(productsJson);
      
      console.log('Producto actualizado con éxito');
    } catch (error) {
      console.error('ERROR: No se pudo actualizar el producto', error);
      return error;
    }
  }
  

  //Metodo para guardar productos en el listado de productos en products.json
  async saveProducts(products) {
    const productsJson = await JSON.stringify(products, null, 2)
    return fs.writeFile(this.path, productsJson, "utf-8" )
  }


  //Metodo para eliminar un producto expecifico, y con el metodo "splice", reordenar los productos en el listado de productos en products.json
  async deleteProduct(id) {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      const productsJson = JSON.parse(data);
      
      const productIndex = productsJson.findIndex((product) => product.id === id);
      if (productIndex === -1) {
        const error = 'Producto a eliminar no encontrado';
        console.log(error);
        throw new Error(error);
      }
  
      const deletedProduct = productsJson.splice(productIndex, 1);
      
      await fs.writeFile(this.path, JSON.stringify(productsJson, null, 2));
      
      console.log('Producto eliminado con éxito');
      /* console.log(deletedProduct); */
      return /* deletedProduct; */
    } catch (error) {
      console.error('ERROR: No se pudo eliminar el producto', error);
      throw error;
    }
  }
}

export default ProductManager;