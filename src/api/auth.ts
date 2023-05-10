import { DB } from '../utils/DB'
import { hashPassword } from '../utils/PasswordEncryption';
import {config} from './config'
const jwt = require('jsonwebtoken');

export const login = (req, res) => {
    const db = new DB();
    const b = req.body;

    console.log(b)

    db.execute(`select * from user where login='${b.login}' and password='${hashPassword(b.password, 'saldkh')}'`)
        .then(data => {
            console.log(data)
            if (data.results.length == 0) {
                res.status(401).send('Invalid login or password')
            }
            else {
                const { uid, last_name, first_name, login, profile_description, img_url } = data.results[0]
                let payload = { uid, last_name, first_name, login, profile_description, img_url }
                const token = jwt.sign(payload, config.TOKEN_SECRET);
                res.status(200).header("auth-token", token).send({ "token": token });
            }
        }) 
}

export const verifyUserToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.status(401).send("Access Denied / Unauthorized request");

    try {
        token = token.split(' ')[1] // Remove Bearer from string

        if (token === 'null' || !token) return res.status(401).send('Unauthorized request');

        let verifiedUser = jwt.verify(token, config.TOKEN_SECRET); 
        if (!verifiedUser) return res.status(401).send('Unauthorized request')

        req.user = verifiedUser;
        next();

    } catch (error) {
        res.status(400).send("Invalid Token");
    } 
} 