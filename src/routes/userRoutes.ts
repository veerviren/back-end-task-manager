const express = require('express')
const router = express.Router()

import {
    signIn, getAllUsers, signUp, deleteUser, updateUser
} from '../controllers/userController'

import { userAuth } from '../middleware/jwt.middleware'


router.get('/', userAuth, getAllUsers)
router.post('/signup', signUp)
router.post('/signin', signIn)
router.delete('/:id', userAuth, deleteUser)
router.patch('/:id', userAuth, updateUser)

module.exports = router