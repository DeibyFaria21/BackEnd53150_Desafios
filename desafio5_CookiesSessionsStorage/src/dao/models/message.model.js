import mongoose from 'mongoose'

const messagesColletion = 'mensajes'

const messageSchema = new mongoose.Schema({
    user:{type: String, required: true, max:50},
    message:{type: String, required: true, max:250},
})


const messageModel = mongoose.model(messagesColletion, messageSchema)

export default messageModel