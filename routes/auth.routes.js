const {Router} = require('express')
const bcript = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const user = require('../models/user')
const router = Router()

router.post('/register',
    [
        check('email', 'некорректный email').isEmail(),
        check('password', 'некорректный пароль').isLength({min: 6})
    ],
    async (req,res)=>{
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array(),message: 'неа'})
        }
        const {email, password} = req.body
        const candidate = await user.findOne({email})
        if(candidate){
            res.status(400).json({message: 'такой пользователь есть'})
        }
        const hashedPassword = await bcript.hash(password, 12)
        const User = new user({email, password: hashedPassword})
        await user.safe()

        res.status(201).json({message: 'создан'})

    }catch(e){
        res.status(500).json({message: 'что-то не так'})
    }
})
router.post('/login', async (req,res)=>{})
module.exports = router