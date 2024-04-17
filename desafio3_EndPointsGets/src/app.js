//Importaciones
const express = require("express")
const ProductManager = require("./productManager.js")


//Configuración del server
const app = express()
const PORT = 8080

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


const managerProduct = new ProductManager()


app.get('/products', async (req, res) => {
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

app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid)
        const product = await managerProduct.getProductById(productId)
  
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json(product)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener el producto' })
    }
})
  
  
app.listen(PORT, () => {
    console.log(`Server UP: Server running on port ${PORT}`)
})