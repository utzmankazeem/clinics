import express from 'express'
import { getLogin, getSignUp, logout, postLogin, postSignup, welcome } 
from '../controller/userController.js'
const router = express.Router()

router.get('/',   welcome)
router.get('/users/signup', getSignUp)
router.post('/users/signup',postSignup)
router.get('/users/login',  getLogin)
router.post('/users/login', postLogin)
router.get('/logout',logout)

export default router;