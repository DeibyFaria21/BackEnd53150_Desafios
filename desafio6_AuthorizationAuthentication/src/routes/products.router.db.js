//Importaciones
import { Router } from 'express'
import productModel from '../dao/models/product.model.js'


//Instanciando Router
const productsRouterdb = Router()


//Handlebars
/* productsRouterdb.get('/products', async (req, res) => {
    try {
        const products = await productModel.find().lean()
        res.render('home',{products})
    } catch (error) {
        console.error('No se encontró el archivo de productos:', error)
    }
}) */
/* res.json(products) */

productsRouterdb.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const query = req.query.query || '';
        const category = req.query.category || '';
        const sort = req.query.sort || '';

        // Obtener todos los productos
        let allProducts = await productModel.find().lean();

        // Aplicar filtros y ordenamiento
        let filteredProducts = allProducts;

        // Filtro por nombre (query)
        if (query) {
            filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
        }

        // Filtro por categoría
        if (category) {
            filteredProducts = filteredProducts.filter(product => product.category === category);
        }

        // Ordenamiento por precio
        if (sort === 'asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        // Calcular paginación
        const totalPages = Math.ceil(filteredProducts.length / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = Math.min(startIndex + limit, filteredProducts.length);

        // Obtener productos para la página actual
        const limitedProducts = filteredProducts.slice(startIndex, endIndex);

        const buildLink = (pageNum) => {
            let link = `/api/products?page=${pageNum}&limit=${limit}`;
            if (query) link += `&query=${query}`;
            if (category) link += `&category=${category}`;
            if (sort) link += `&sort=${sort}`;
            return link;
        };

        const prevLink = page > 1 ? buildLink(page - 1) : null;
        const nextLink = page < totalPages ? buildLink(page + 1) : null;

        // Construir objeto de respuesta con información de paginación
        const response = {
            status: 'success',
            payload: limitedProducts,
            pagination: {
                totalPages: totalPages,
                currentPage: page,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevLink: prevLink,
                nextLink: nextLink
            }
        };
        const user = req.session.user

        res.render('home', {payload: response, user: user})

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

//Handlebars
productsRouterdb.get('/products/:pid', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).lean()
        if (!product) {
            return res.status(404).json({ error: 'Producto no existe' })
        }
        res.render('detail', { product })
        /* res.send(product) */
    } catch (error) {
        console.error('Error al encontrar el producto', error)
        res.status(500).render('error', { message: 'Error al encontrar el producto' })
    }
})

//Postman
productsRouterdb.post('/products', async (req, res) => {
    let { title, description, code, price, stock, category, thumbnail} = req.body
    console.log(req.body)
    if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
        res.send({status: "error", error: "Todos los campos son obligatorios"})
    }
    let result = await productModel.create({title, description, code, price, status:true, stock, category, thumbnail})
    console.log(result)
    res.send({ result: "success", payload: result })
})

//Handlebars
/* productsRouterdb.get('/addProduct', (req, res) => {
    res.render('addProduct',{})
}) */

//Handlebars
/* productsRouterdb.post('/addProduct', async (req, res) => {
    try {
        let { title, description, code, price, stock, category, thumbnail } = req.body

        if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' })
        }
        let newProduct = await productModel.create({
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnail
        })
        res.render('addProduct')
    } catch (error) {
        console.error('Error al agregar un nuevo producto:', error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}) */

//Postman
productsRouterdb.put('/products/:pid', async (req, res) => {
    let { pid } = req.params
    let updateProduct = req.body

    if (!updateProduct.title || !updateProduct.description  || !updateProduct.code || !updateProduct.price || !updateProduct.status || !updateProduct.stock || !updateProduct.category || !updateProduct.thumbnail) {
        res.send({ status: "error", error: "Debe completar los campos obligatorios" })
    }
    let result = await productModel.updateOne({ _id: pid }, updateProduct)
    res.send({ result: "success", payload: result })
})

//Handlebars
/* productsRouterdb.get('/products/update/:pid', async (req, res) => {
    try {
        const productById = await productModel.findByIdAndUpdate(req.params.pid).lean()
        res.render('updateProduct', { productById })
    } catch (error) {
        console.log(error.message)
    }
})

productsRouterdb.post('/products/update/:pid', async (req, res) => {
    try {
        let { pid } = req.params
        console.log('Datos recibidos para actualizar:', req.body)
        await productModel.findByIdAndUpdate(pid, req.body)
        res.redirect('/api/products')
    } catch (error) {
        console.error('Error al actualizar el producto:', error)
        res.status(500).render('error', { message: 'Error al actualizar el producto.' })
    }
}) */

//Postman
productsRouterdb.delete('/products/:pid', async (req, res) => {
    let { pid } = req.params
    let result = await productModel.deleteOne({ _id: pid })
    res.send({ result: "success", payload: result })
})

/* productsRouterdb.get('/products/delete/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        await productModel.findByIdAndDelete(pid)
        res.redirect('/api/products')
    } catch (error) {
        console.error('Error al eliminar el producto:', error)
        res.status(500).render('error', { message: 'Error al eliminar el producto.' })
    }
}) */

export default productsRouterdb;