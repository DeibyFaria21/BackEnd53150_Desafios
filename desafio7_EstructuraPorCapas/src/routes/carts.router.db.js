//Importaciones
import { Router } from 'express'
import mongoose from 'mongoose'
import cartModel from '../dao/models/cart.model.js'
import productModel from '../dao/models/product.model.js'
import userModel from '../dao/models/user.model.js'


//Instanciando Router
const cartsRouterdb = Router()


//Postman
/* cartsRouterdb.post('/', async (req, res) => {
    try {
        const result = await cartModel.create({})
        res.send({ result: 'success', payload: result })
    } catch (error) {
        console.log(error)
    }
}) */

const getActualCart = async (userId) => {
    try {
        const cart = await cartModel.findOne({ user: userId }).populate('products.productId').lean();
        return cart;
    } catch (error) {
        throw new Error('Error al obtener el carrito');
    }
};


//Postman Metodo GET/:cid
cartsRouterdb.get('/:cid', async (req, res) => {

    try {
        let {cid} = req.params
        /* const cid = "664d73c255cc4eb27f46d21c" */
        if(!cid){
           res.send({ status: 'error', error: 'Es necesario el ID de carrito' })
        }
        const result = await cartModel.findById({_id: cid}).populate('products.productId').lean()
        if (!result) {
            return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
        }
        const user = req.session.user

        //res.render('cartDetail', { products: result.products, user: user })
        res.send({ result: 'success', payload: result })
   } catch (error) {
       console.log(error)
   }
})


//Postman Metodo POST/:cid/product/:pid
cartsRouterdb.post('/:cid/product/:pid', async (req, res) => {
    try {
        /* const {cid, pid} = req.params; */
        const cid = req.params.cid;
        const pid = req.params.pid;
        let cart = await cartModel.findById(cid)
        if(!cart){
            res.send({status: 'error', error: 'El carrito buscado no se encontró'})
        }
        const boughtProduct = cart.products.find(item => item.productId.toString() === pid);
        if(!boughtProduct){
            cart.products.push({productId:pid, quantity:1})
        }else{
            boughtProduct.quantity++
        }
        await cart.save();
        res.send({ status: 'success', message: 'Producto agregado/actualizado en el carrito', payload: boughtProduct });
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'error', error: 'Error al agregar el producto al carrito' });
    }
})

//Metodo PUT/:cid/product/:pid
cartsRouterdb.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity: newQuantity } = req.body;

    try {
        // Validar que newQuantity es un entero no negativo
        if (!Number.isInteger(newQuantity) || newQuantity < 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número entero no negativo' });
        }

        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productToUpdate = cart.products.find(product => product.productId.toString() === pid);
        if (!productToUpdate) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        productToUpdate.quantity = newQuantity;

        await cart.save();

        console.log('Cantidad del producto actualizada en el carrito y datos guardados');

        const updatedCart = await cartModel.findById(cid).populate('products.productId', 'title description category price');

        return res.status(200).json(updatedCart);
    } catch (err) {
        console.error('Error al actualizar la cantidad del producto en el carrito', err);
        return res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});
    
//Metodo DELETE/:cid/
cartsRouterdb.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        
        const cart = await cartModel.findById(cartId);
        
        if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        
        cart.products = [];
        const updatedCart = await cart.save();
        
        console.log(updatedCart, 'Carrito vaciado y actualizado');

        return res.redirect(`/carts/${cartId}`);
        /* return res.status(200).json(updatedCart); */

    } catch (err) {
        console.error('Error al eliminar productos del carrito', err);
        return res.status(500).json({ error: 'Error al eliminar productos del carrito' });
    }
});

//Metodo DELETE/:cid/product/:pid
// cartsRouterdb.delete('/:cid/product/:pid', async (req, res) => {
//     const cid = req.params.cid;
//     const pid = req.params.pid;
//     try {
//         const cart = await cartModel.findById(cid).populate('products.productId');
//         if (!cart) {
//         return res.status(404).json({ error: 'Carrito no encontrado' });
//         }
  
//         const productIndex = cart.products.findIndex(product => {
//         return product.productId && product.productId._id.toString() === pid;
//         });
  
//         if (productIndex === -1) {
//         return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
//         }
  
//         cart.products.splice(productIndex, 1);
//         await cart.save();
  
//         console.log('Producto eliminado del carrito y datos actualizados y guardados');
        
//         return res.redirect(`/carts/664d73c255cc4eb27f46d21c`);

//         /* return res.status(200).json({ message: 'Producto eliminado del carrito con éxito' }); */
  
//     } catch (err) {
//         console.error('Error al eliminar el producto del carrito', err);
//         return res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
//     }
//   });

/* cartsRouterdb.delete('/product/:pid', async (req, res) => {
    const userId = req.session.user._id;
    const pid = req.params.pid;

    try {
        const cart = await getActualCart(userId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(product => product.productId.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        cart.products.splice(productIndex, 1);
        await cart.save();

        res.redirect(`carts`);
    } catch (err) {
        console.error('Error al eliminar el producto del carrito', err);
        return res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
}); */

//Modificando la ruta
cartsRouterdb.delete('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    /* const userId = req.session.user._id; */  // Obtener el ID del usuario desde la sesión
    const pid = req.params.pid;  // Obtener el ID del producto desde los parámetros de la URL

    try {
        // Obtener el carrito actual del usuario
        const cart = await cartModel.findById(cartId);
        /* const cart = await getActualCart(userId); */

        /* const cartId = user.cart._id; */
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Encontrar el índice del producto dentro del carrito
        const productIndex = cart.products.findIndex(product => product.productId.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        // Eliminar el producto del carrito
        cart.products.splice(productIndex, 1);
        await cart.save();

        // Redirigir a la página de carritos (o ajustar según tu necesidad)
        res.redirect(`/carts/${cartId}`);

    } catch (err) {
        console.error('Error al eliminar el producto del carrito', err);
        return res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});


  //METODOS PARA BOTONES

  //Metodo POST para agregar producto a carrito
  /* cartsRouterdb.post('/add', async (req, res) => {
    const { productId, quantity } = req.body;
    const cartId = "664d73c255cc4eb27f46d21c";

    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'ID de producto no válido' });
        }

        const parsedQuantity = parseInt(quantity);
        if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número entero positivo' });
        }

        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const existingProductIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (existingProductIndex > -1) {
            cart.products[existingProductIndex].quantity += parsedQuantity;
        } else {
            cart.products.push({ productId, quantity: parsedQuantity });
        }

        await cart.save();
        console.log('Producto agregado al carrito');

        res.redirect('/carts/664d73c255cc4eb27f46d21c');

    } catch (error) {
        console.error('Error al agregar el producto al carrito', error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
}); */

cartsRouterdb.post('/add', async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.session.user._id;
     
    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'ID de producto no válido' });
        }

        const parsedQuantity = parseInt(quantity);
        if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número entero positivo' });
        }

        // Busca el usuario para obtener el ID del carrito
        const user = await userModel.findById(userId).populate('cart');
        if (!user || !user.cart) {
            return res.status(404).json({ error: 'Carrito no encontrado para este usuario' });
        }

        const cartId = user.cart._id; // Obtiene el ID del carrito del usuario

        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const existingProductIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (existingProductIndex > -1) {
            cart.products[existingProductIndex].quantity += parsedQuantity;
        } else {
            cart.products.push({ productId, quantity: parsedQuantity });
        }

        await cart.save();
        console.log('Producto agregado al carrito');

        res.redirect(`/carts/${cartId}`);

    } catch (error) {
        console.error('Error al agregar el producto al carrito', error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});


export default cartsRouterdb;