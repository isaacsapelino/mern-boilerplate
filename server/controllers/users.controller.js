const User = require('../models/users');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PRIV_KEY = fs.readFileSync((path.resolve('keys', 'rsa_private_08022021.pem')));
const PUB_KEY = fs.readFileSync((path.resolve('keys', 'rsa_public_08022021.pem')));

exports.getUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ where: id });
    if (!user) {
        return res.status(400).send({
            message: `No user found on id ${id}`,
        });
    }
}

exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;

        if (!(email && password && firstName && lastName))
            res.status(400).json({
                success: false,
                message: "All inputs must not be null."
            });
        
        const oldUser = await User.findOne({
            where: {
                email
            }
         });

        if (oldUser) {
            return res.status(400).json({
                success: false,
                message: "User does exist. Please login",
            });
        }

        const user = User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            username,
            password
        }).then(result => {
            console.log(result.dataValues);
            const token = jwt.sign({
                id: result.dataValues.id,
                username: result.dataValues.username,
            }, PRIV_KEY, {
                expiresIn: "2h",
                algorithm: 'RS256',
            });
            user.token = token;
            res.status(201).json(user);
        });

    } catch (err) {
        console.log(err);
    }
}