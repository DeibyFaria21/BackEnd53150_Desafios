//Importaciones
import { Router } from 'express'
const productsRouter = Router()
import ProductManager from '../dao/managersfs/productManager.js'


//Instanciando clase ProductManager
const managerProduct = new ProductManager()


//Ruta de endpoint para obtener el listado de productos con o sin límite
productsRouter.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit)
    const products = await managerProduct.getProducts()
    if (!isNaN(limit) && limit > 0) {
      const limitedProducts = products.slice(0, parseInt(limit))
      console.log(limitedProducts)
      return res.json(limitedProducts)
    }
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener los productos' })
  }
})


//Ruta de endpoint para obtener un producto especificado por ID del listado de productos
productsRouter.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid)
    const product = await managerProduct.getProductById(productId)
    if (!product.pid) {
      return res.json(product)
      /* res.status(404).json({ error: 'Producto no encontrado' }) */
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener el producto' })
  }
})


//Ruta de endpoint para agregar un producto al listado de productos
productsRouter.post('/', async (req, res) => {
  const product = req.body;
  if (!product || Object.values(product).some(value => !value)) {
    return res.status(400).json({ status: "error", error: 'Valores incompletos' });
  }

  try {
    const result = await managerProduct.addProduct(product.title, product.description, product.code, product.price, product.status, product.stock, product.category, product.thumbnail);
    if (typeof result === "string") {
      return res.status(400).json({ status: "error", error: result });
    }
    return res.status(201).json({ status: "success", message: 'Producto creado'/* , product: result */});
  } catch (error) {
    return res.status(500).json({ status: "error", error: 'Error al crear el producto' });
  }
});


//Ruta de endpoint para actualizar un producto especificado del listado de productos
productsRouter.put('/:pid', async (req, res) => {
  const data = req.body
  const productId = parseInt(req.params.pid)
  const products = await managerProduct.getProducts()
  const product = products.find(product => product.id === productId)
  if (!product) {
    return res.status(404).json({
      error: 'Producto para actualización no encontrado'
    })
  }
  product.id = product.id
  product.title = data.title || product.title
  product.description = data.description || product.description
  product.code = data.code || product.code
  product.price = data.price || product.price
  product.status = data.status || product.status
  product.stock = data.stock || product.stock
  product.category = data.category || product.category
  product.thumbnail = data.thumbnail || product.thumbnail
  managerProduct.updateProduct(product.id, data)
  // manager.saveProducts(products)
  return res.json(product)
})


//Ruta de endpoint para eliminar un producto especificado del listado de productos
productsRouter.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid)
  managerProduct.deleteProduct(productId)
  return res.status(204).json({})
})

export default productsRouter;