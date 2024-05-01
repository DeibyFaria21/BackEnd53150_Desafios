import express from 'express'

const productsRouter = express.Router()
/* const file = './data/productos.json' */


productsRouter.get("/", async (req, res) => {
    try {
        res.render('home', {})
    } catch (error) {
        console.error('Error:', error);
    }
})


export default productsRouter