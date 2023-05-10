import { DB } from '../utils/DB'
import { hashPassword } from '../utils/PasswordEncryption'
import { config } from './config';
const jwt = require('jsonwebtoken');

export default function postUser(req, res) {
    const db = new DB();
    const b = req.body;
    console.log(b)

    new Promise((resolve) => {
        if (!b.image) resolve({data: {link: null}});

        const fd = new FormData();
        fd.append('image', b.image.split(',')[1])
        fd.append('secret_key', 'bOdV0NHwnQ6oaX9Kr5eqjvlASegXojHbzZd')
    
        fetch('https://api.imageban.ru/v1', {
            method: 'POST',
            headers: {
                'Authorization': 'TOKEN 0dJgjPGK6LXxG5bwhwLk'
            },
            body: fd
        })
        .then(response => response.json()) 
        .then(r => {
            console.log('картинка загрузилась')
            console.log(r);
            resolve({data: {link: r.data.link}})
        })
        .catch(error => {
            console.log('что-то не так')
            console.log(error)
            res.status(500).json({ error: error });
        });
    })
    .then((r:any) => {
        db.execute(`insert into user(
            first_name, 
            last_name, 
            login, 
            profile_description,
            password,
            img_url
        ) values (
            '${b.firstName}',
            '${b.lastName}',
            '${b.login}',
            '${b.description}',
            '${hashPassword(b.password, 'saldkh')}',
            '${r.data.link || ''}'
        )`)
            .then(data => data.results)
            .then(data => {
                let payload = { 
                    uid: data.insertId,
                    last_name: b.lastName,
                    first_name: b.firstName,
                    login: b.login,
                    profile_description: b.description, 
                    img_url: null 
                }
                const token = jwt.sign(payload, config.TOKEN_SECRET);
                res.status(200).header("auth-token", token).send({ "token": token });
            })
            .catch(err => {
                if (err.code === "ER_DUP_ENTRY") {
                    res.status(409).send('Login already taken')
                }
                else {
                    res.status(500).send("Some Error")
                }
            })
    })
  }