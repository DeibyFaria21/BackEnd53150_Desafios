import { Router } from 'express';
import passport from 'passport';
import userModel from '../dao/models/user.model.js';
import cartModel from '../dao/models/cart.model.js';


const usersRouter = Router();

//EJEMPLO EN CLASE
/* usersRouter.post('/register',
passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }),
(req, res) => {
    res.redirect('/login');
}); */


//NUEVA RUTA
usersRouter.post('/register',
passport.authenticate('register', { failureRedirect:'failregister' }),
async (req, res) => {
  try {
    console.log(req.user , 'register')
    let user = req.user;
    
    if (user.email === 'adminCoder@coder.com') {
      user.role = 'admin';
    } else {
      user.role = 'usuario'; 
    }

    /* user = await user.save(); */

    let newCart = await cartModel.create({ items: [], user: user._id });
    user.cart = newCart._id;
    await user.save();
    
    return res.redirect('/login');
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

usersRouter.get('/failregister', (req, res) => {
    console.log("Registro fallido");
    return res.send({error: 'Error al registrarse'})
})

//ANTERIOR RUTA
/* usersRouter.post('/register', async (req, res) => {
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
}); */


//NUEVA RUTA
usersRouter.post('/login',
passport.authenticate("login", { failureRedirect: '/api/sessions/faillogin' }),
(req, res) => {
    try{
        const user = req.user
        if (!user) return res.status(400).send({ status: "error", error: "Datos Incorrectos" });
        req.session.user = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart
        };
        console.log(user, 'login');
        res.redirect('/products');
    } catch (error) {
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});

usersRouter.get('/faillogin', (req, res) => {
    return res.send({error: 'Error al iniciar sesión'})
})

//ANTERIOR RUTA
/* usersRouter.post('/login', async (req, res) => {
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
}); */


usersRouter.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});


usersRouter.get('/github',passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
})

usersRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login'}), async (req, res) => {
    req.session.user = req.user;
    return res.redirect('/products');
})

usersRouter.get('/current', (req, res) => {
    return res.json({
        user:req.user,
        session:req.session
    });
})


export default usersRouter;