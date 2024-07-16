import { Router } from 'express';
import mongoose from 'mongoose';
import cartModel from '../dao/models/cart.model.js';
import productModel from '../dao/models/product.model.js';
import userModel from '../dao/models/user.model.js';

const cartsRouterdb = Router();

const getActualCart = async (userId) => {
    try {
        const cart = await cartModel.findOne({ user: userId }).populate('products.productId').lean();
        return cart;
    } catch (error) {
        throw new Error('Error al obtener el carrito');
    }
};

// Ruta para obtener todos los carritos del usuario
cartsRouterdb.get('/', async (req, res) => {
    const userId = req.session.user.id;

    try {
        const carts = await cartModel.find({ user: userId }).populate('products.productId');
        res.json({ status: 'success', payload: carts });
    } catch (error) {
        console.error('Error al obtener los carritos del usuario', error);
        res.status(500).json({ error: 'Error al obtener los carritos del usuario' });
    }
});

// Ruta para obtener un carrito específico por su ID (cid)
cartsRouterdb.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const userId = req.session.user.id;

    try {
        const cart = await cartModel.findOne({ _id: cid, user: userId }).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json({ status: 'success', payload: cart });
    } catch (error) {
        console.error('Error al obtener el carrito', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// Ruta para agregar un producto al carrito específico por su ID (cid)
cartsRouterdb.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const userId = req.session.user.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ error: 'IDs no válidos' });
        }

        const parsedQuantity = parseInt(quantity);
        if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número entero positivo' });
        }

        const cart = await cartModel.findOne({ _id: cid, user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const product = await productModel.findById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const existingProductIndex = cart.products.findIndex(p => p.productId.toString() === pid);
        if (existingProductIndex > -1) {
            cart.products[existingProductIndex].quantity += parsedQuantity;
        } else {
            cart.products.push({ productId: pid, quantity: parsedQuantity });
        }

        await cart.save();
        console.log('Producto agregado al carrito');

        res.redirect(`/api/carts/${cid}`);
    } catch (error) {
        console.error('Error al agregar el producto al carrito', error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

// Ruta para actualizar la cantidad de un producto en el carrito específico por su ID (cid)
cartsRouterdb.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const userId = req.session.user.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ error: 'IDs no válidos' });
        }

        const parsedQuantity = parseInt(quantity);
        if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número entero positivo' });
        }

        const cart = await cartModel.findOne({ _id: cid, user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productToUpdate = cart.products.find(p => p.productId.toString() === pid);
        if (!productToUpdate) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        productToUpdate.quantity = parsedQuantity;
        await cart.save();

        res.json({ status: 'success', message: 'Cantidad de producto actualizada en el carrito', payload: productToUpdate });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito', error);
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

// Ruta para eliminar un producto del carrito específico por su ID (cid)
cartsRouterdb.delete('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const userId = req.session.user.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ error: 'IDs no válidos' });
        }

        const cart = await cartModel.findOne({ _id: cid, user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        cart.products.splice(productIndex, 1);
        await cart.save();

        res.json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito', error);
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});

// Ruta para eliminar todos los productos del carrito específico por su ID (cid)
cartsRouterdb.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    const userId = req.session.user.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).json({ error: 'ID no válido' });
        }

        const cart = await cartModel.findOne({ _id: cid, user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        cart.products = [];
        await cart.save();

        res.json({ status: 'success', message: 'Productos eliminados del carrito' });
    } catch (error) {
        console.error('Error al eliminar productos del carrito', error);
        res.status(500).json({ error: 'Error al eliminar productos del carrito' });
    }
});

// Ruta para agregar un producto nuevo al carrito específico por su ID (cid)

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

/* cartsRouterdb.post('/add', async (req, res) => {
    const { productId, quantity } = req.body;
    const cartId = await userModel.findById(userId).populate('cart');

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

        res.redirect(`/carts/${cartId}`);

    } catch (error) {
        console.error('Error al agregar el producto al carrito', error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
}); */

/* cartsRouterdb.post('/:cid/add', async (req, res) => {
    const { cid } = req.params;
    const { productId, quantity } = req.body;
    const userId = req.session.user.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'IDs no válidos' });
        }

        const parsedQuantity = parseInt(quantity);
        if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número entero positivo' });
        }

        const cart = await cartModel.findOne({ _id: cid, user: userId });
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

        res.redirect(`/api/carts/${cid}`);
    } catch (error) {
        console.error('Error al agregar el producto al carrito', error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
}); */

export default cartsRouterdb;
