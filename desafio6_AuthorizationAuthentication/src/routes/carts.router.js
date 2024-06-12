//Importaciones
import { Router } from 'express'
const cartsRouter = Router()
import { promises } from 'fs'
import CartManager from '../dao/managersfs/cartManager.js'


//Instanciando clase CarttManager
const managerCart = new CartManager()


//Metodo POST
cartsRouter.post('/', async (req, res) => {
  try {
    const carts = await managerCart.createCart();
    console.log('El carrito se ha guardado correctamente');
    res.status(201).json(carts);
  } catch (error) {
    console.log('Error al escribir en el archivo:', error);
    res.status(500).json({ error: 'Error al guardar el carrito' });
  }
})


//Metodo GET/:cid
cartsRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid)
    const cart = await managerCart.getCartsById(cartId)

    return res.status(200).json(cart)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al obtener el carrito' })
  }
})


//Metodo POST/:cid/product/:pid
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const cid = parseInt(req.params.cid)
  const pid = parseInt(req.params.pid)
  const carts = await managerCart.getCarts()
  const cart = carts.find(cart => cart.cid === cid)

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' })
  }
  const existingProduct = cart.products.find(product => product.id === pid)
  if (existingProduct) {
    existingProduct.quantity += 1
  } else {
    cart.products.push({ id: pid, quantity: 1 })
  }

  try {
    await promises.writeFile('./carts.json', JSON.stringify(carts, null, 2))
    console.log('Datos del carrito actualizados y guardados')
    return res.status(200).json(carts)
  } catch (error) {
    console.error('Error al escribir en el archivo:', error)
    return res.status(500).json({ error: 'Error al guardar los datos del carrito' })
  }
})

export default cartsRouter;