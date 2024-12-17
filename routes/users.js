import express from 'express'
import { getLogin, getSignUp, logout, postLogin, postSignup, welcome } 
from '../controller/userController.js'
const router = express.Router()

router.get('/', welcome)
router.get('/signup', getSignUp)
router.post('/signup', postSignup)
router.get('/login', getLogin)
router.post('/login', postLogin)
router.get('/logout', logout)

export default router;