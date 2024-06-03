import { Router } from 'express'
import messageModel from '../dao/models/message.model.js'


const messagesRouterdb = Router()


messagesRouterdb.get('/messages', async (req, res) => {
    try {
      const messages = await messageModel.find().sort({ timestamp: 1 }).lean();
      res.render('chat', { messages }); // Renderiza la vista 'chat' y pasa los mensajes como datos
    } catch (error) {
      res.status(500).render('error', { error: 'Error al obtener los mensajes' }); // Renderiza una vista de error en caso de error
    }
});

messagesRouterdb.post('/messages', async (req, res) => {
  try {
    const { user, message } = req.body;
    const newMessage = new messageModel({ user, message });
    await newMessage.save();
    res.redirect('/api/messages'); // Redirecciona al cliente de vuelta a la página de chat después de enviar el mensaje
  } catch (error) {
    res.status(500).render('error', { error: 'Error al enviar el mensaje' }); // Renderiza una vista de error en caso de error
  }
});


export default messagesRouterdb