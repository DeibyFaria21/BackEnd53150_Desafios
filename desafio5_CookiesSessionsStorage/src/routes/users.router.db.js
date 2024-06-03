import { Router } from 'express';
import userModel from '../dao/models/user.model.js';


const usersRouter = Router();

usersRouter.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const newUser = new userModel({ first_name, last_name, email, age, password });
        if (newUser.email === 'adminCoder@coder.com' && newUser.password === 'adminCod3r123') {
            newUser.role = 'admin';
        } else {
            newUser.role = 'usuario'; 
        }
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error al registrar usuario');
    }
});

usersRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    try {
        const user = await userModel.findOne({ email });
        console.log(user)
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        req.session.user = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age, 
            role: user.role
        };
        console.log(req.session.user)
        res.redirect('/api/products');

    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    }
});

usersRouter.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});

export default usersRouter;