const date = require('date-and-time')
import { DB } from '../utils/DB'

export default function postPost(req, res) {
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
        db.execute(`insert into post(authorId, content, imgUrl, date) values (
            ${b.author.uid}, 
            '${b.text}',
            '${r.data.link || ''}', NOW()
        )`)
        .then(() => {
            res.status(200).send({
                authorUID: b.author.uid,
                authorFirstName: b.author.first_name,
                authorLastName: b.author.last_name,
                authorImg: b.author.img_url,
                date: date.format(new Date(),'DD.MM.YYYY HH:mm'), 
                imgUrl: r.data.link || '',
                text: b.text
            })
        })
    })
    .catch((err) => res.status(400).send(err))
  }