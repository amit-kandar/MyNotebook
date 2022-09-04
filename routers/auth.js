const express = require('express')
const { create_user_schema, user_login_schema } = require('../controller/auth_validation')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchUser = require('../middleware/fetchUser')

const JWT_SECRET = "Iamagoodboy$13"

//Router 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', async (req, res) => {
    let success = false;
    const { error } = create_user_schema.validate(req.body)
    if (error) {
        return res.status(400).json({error, success})
    }

    try {
        let user = User.findOne({ email: req.body.email })
        if (!user) {
            success=false
            return res.json("email already exits", success)
        }

        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)

        //Create a new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, authtoken })
    } catch (error) {
        res.status(500).json(error.message)
    }
})

//Router 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', async (req, res) => {
    let success = false;
    const { error } = user_login_schema.validate(req.body)

    if (error) {
        return res.status(400).send(error)
    }

    const { email, password } = req.body

    try {
        let user = await User.findOne({ email })
        if (!user) {
            success = false
            return res.status(400).json({ success, error: "Incorrect email" })
        }

        const paswordCompare = await bcrypt.compare(password, user.password)
        if (!paswordCompare) {
            return res.status(400).json({ error: "Invalid password" })
        }
        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, authtoken })
    } catch (error) {
        res.status(500).json(error.message)
    }

})

//Router 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const userid = req.user.id;
        const user = await User.findById(userid).select("-password")
        res.json(user)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

module.exports = router