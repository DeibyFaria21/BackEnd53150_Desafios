socket = io()

const listProducts = document.getElementById('products')

function appendProduct(product) {

    const newProduct = document.createElement('li')
    let content = ""

    Object.entries(product).forEach(([key, value]) => {
        content = content + ` ${key} : ${value} `
    });
    newProduct.textContent = content
    listProducts.append(newProduct)
}


socket.on('products', products => {

    listProducts.innerHTML = ""
    products.map((product) => {
        appendProduct(product)
    })
})