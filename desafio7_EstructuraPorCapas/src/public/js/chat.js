const socket = io();

const listMessages = document.getElementById('messages');
const form = document.getElementById('messageForm');

form.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    const user = document.getElementById('user').value;
    const message = document.getElementById('text').value;
    socket.emit('addMessage', { user, message });
});

socket.on('messagesRealTime', messages => {
    listMessages.innerHTML = ''; // Limpia la lista de mensajes
    messages.forEach(message => {
        const newMessage = document.createElement('li');
        newMessage.innerHTML = `<strong>User: </strong>${message.user}, <strong>Mensaje: </strong>${message.message}`;
        listMessages.appendChild(newMessage);
    });
});



/* const socket = io()

const listMessages = document.getElementById('messages')

const btnSend = document.getElementById('btn-send')

btnSend.addEventListener('click', () => {
    const user = document.getElementById('user').value;
    const message = document.getElementById('text').value;
    socket.emit('addMessage', { user, message });
})

socket.on('messagesRealTime', messages => {
    listMessages.innerHTML = ``;
    messages.forEach(message => {
        const newMessage = document.createElement('li');

        newMessage.innerHTML = `<strong>User: </strong>${message.user}, <strong>Mensaje: </strong>${message.message}
        `;
        listMessages.appendChild(newMessage);
    });
}) */