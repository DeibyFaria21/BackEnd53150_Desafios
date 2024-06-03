import { Router } from 'express';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

const viewsRouter = Router()


/* viewsRouter.get("/chat",(req,res)=>{
    res.render("chat")
}) */

viewsRouter.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

viewsRouter.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});

viewsRouter.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user });
});


export default viewsRouter