socket = io()

const listProducts = document.getElementById('productsRealTime')

const btnSend = document.getElementById('btn-send')

btnSend.addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const code = document.getElementById('code').value;
    const price = document.getElementById('price').value;
    socket.emit('addProduct', { title, description, code, price});

})

socket.on('productsRealTime', products => {
    listProducts.innerHTML = ``;
    products.forEach(product => {
        const newProduct = document.createElement('li');
        const btnDelete = document.createElement('button');

        btnDelete.innerHTML = 'Eliminar';
        btnDelete.addEventListener('click', () => {
            socket.emit('deleteProduct', product.id)
            console.log(product.id);
        });
        newProduct.innerHTML = `<strong>Title: </strong>${product.title}, <strong>Description: </strong>${product.description},
        <strong>Code: </strong>${product.code}, <strong>Price: </strong>${product.price}
        `;
        listProducts.appendChild(newProduct);
        listProducts.appendChild(btnDelete);
    });
})