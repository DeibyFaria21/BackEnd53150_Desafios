import { Router } from 'express';
import mongoose from 'mongoose';
import cartModel from '../dao/models/cart.model.js';
import productModel from '../dao/models/product.model.js';

const cartsRouterdb = Router();

const getActualCart = async (userId) => {
    try {
        const user = await userModel.findById(userId).populate('cart');
        return user.cart;
    } catch (error) {
        throw new Error('Error al obtener el carrito');
    }
};

cartsRouterdb.get('/', async (req, res) => {
    try {
        const userId = req.session.user.id;
        const cart = await getActualCart(userId);

        if (!cart) {
            return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
        }

        res.send({ result: 'success', payload: cart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: 'Error al obtener el carrito' });
    }
});

cartsRouterdb.post('/product/:pid', async (req, res) => {
    try {
        const userId = req.session.user.id;
        const pid = req.params.pid;
        const cart = await getActualCart(userId);

        if (!cart) {
            return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
        }

        const boughtProduct = cart.products.find(item => item.productId.toString() === pid);
        if (!boughtProduct) {
            cart.products.push({ productId: pid, quantity: 1 });
        } else {
            boughtProduct.quantity++;
        }
        await cart.save();

        res.send({ status: 'success', message: 'Producto agregado/actualizado en el carrito', payload: boughtProduct });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: 'Error al agregar el producto al carrito' });
    }
});

cartsRouterdb.put('/product/:pid', async (req, res) => {
    const userId = req.session.user.id;
    const pid = req.params.pid;
    const { quantity: newQuantity } = req.body;

    try {
        if (!Number.isInteger(newQuantity) || newQuantity < 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número entero no negativo' });
        }

        const cart = await getActualCart(userId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productToUpdate = cart.products.find(product => product.productId.toString() === pid);
        if (!productToUpdate) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        productToUpdate.quantity = newQuantity;
        await cart.save();

        const updatedCart = await cartModel.findById(cart._id).populate('products.productId', 'title description category price');
        return res.status(200).json(updatedCart);
    } catch (err) {
        console.error('Error al actualizar la cantidad del producto en el carrito', err);
        return res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

cartsRouterdb.delete('/', async (req, res) => {
    const userId = req.session.user.id;

    try {
        const cart = await getActualCart(userId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        cart.products = [];
        await cart.save();

        res.redirect(`/carts`);
    } catch (err) {
        console.error('Error al eliminar productos del carrito', err);
        return res.status(500).json({ error: 'Error al eliminar productos del carrito' });
    }
});

cartsRouterdb.delete('/product/:pid', async (req, res) => {
    const userId = req.session.user.id;
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

        res.redirect(`/carts`);
    } catch (err) {
        console.error('Error al eliminar el producto del carrito', err);
        return res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});

cartsRouterdb.post('/add', async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.session.user.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'ID de producto no válido' });
        }

        const parsedQuantity = parseInt(quantity);
        if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número entero positivo' });
        }

        const cart = await getActualCart(userId);
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

        res.redirect(`/carts`);
    } catch (error) {
        console.error('Error al agregar el producto al carrito', error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});


export default cartsRouterdb;
