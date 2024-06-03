const socket = io()


socket.on('listaProductos', (products)=>{

    const listProducts = document.getElementById('products')

    listProducts.innerHTML = "";
    console.log(products)
    products.forEach(product => {
        
        // Crear un nuevo elemento de lista
        const listItem = document.createElement('li');

        // Insertar el contenido del producto
        listItem.innerHTML = `
            <strong>Título:</strong> ${product.title}<br>
            <strong>Descripción:</strong> ${product.description}<br>
            <strong>Código:</strong> ${product.code}<br>
            <strong>Precio:</strong> ${product.price}<br>
            <strong>Estado:</strong> ${product.status}<br>
            <strong>Stock:</strong> ${product.stock}<br>
            <strong>Categoría:</strong> ${product.category}<br>
            <strong>Thumbnail:</strong> ${product.thumbnail}<br>
            <hr>
        `;
        
        // Agregar el elemento a la lista
        listProducts.appendChild(listItem);
    });
})