import { Router } from 'express';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';
import productModel from '../dao/models/product.model.js';
import cartModel from '../dao/models/cart.model.js';

const viewsRouter = Router()


/* viewsRouter.get("/chat",(req,res)=>{
    res.render("chat")
}) */

viewsRouter.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

viewsRouter.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});

viewsRouter.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user });
});


viewsRouter.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const query = req.query.query || '';
        const category = req.query.category || '';
        const sort = req.query.sort || '';

        // Construir filtro dinámico
        const filter = {};

        if (query) {
            filter.name = { $regex: query, $options: 'i' }; // Filtrado por nombre (query)
        }

        if (category) {
            filter.category = category; // Filtrado por categoría
        }

        // Construir opciones de ordenamiento
        const sortOptions = {};
        if (sort) {
            if (sort === 'asc') {
                sortOptions.price = 1;
            } else if (sort === 'desc') {
                sortOptions.price = -1;
            }
        }

        // Calcular el número total de productos que cumplen los filtros
        const totalProducts = await productModel.countDocuments(filter);

        // Calcular paginación
        const totalPages = Math.ceil(totalProducts / limit);
        const skip = (page - 1) * limit;

        // Obtener productos con filtros y ordenamiento aplicados
        const products = await productModel.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean();

        const buildLink = (pageNum) => {
            let link = `/products?page=${pageNum}&limit=${limit}`;
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
            payload: products,
            pagination: {
                totalPages: totalPages,
                currentPage: page,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevLink: prevLink,
                nextLink: nextLink
            }
        };
        const user = req.session.user;
        if (!user.cart) {
            const cart = await cartModel.findOne({ user: user._id }).lean();
            user.cart = cart._id;
        }

        res.render('home', { payload: response, user: user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

//Handlebars
viewsRouter.get('/products/:pid', async (req, res) => {
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

viewsRouter.get('/carts/:cid', async (req, res) => {
    try {
        let {cid} = req.params
        /* let cid = "664d73c255cc4eb27f46d21c" */
        if(!cid){
           res.send({ status: 'error', error: 'Es necesario el ID de carrito' })
        }
        const result = await cartModel.findById({_id: cid}).populate('products.productId').lean()
        if (!result) {
            return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
        }
        const user = req.session.user

        res.render('cartDetail', { products: result.products, user: user })

   } catch (error) {
       console.log(error)
   }
})


export default viewsRouter