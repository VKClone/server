import * as path from 'path';
import getUser from './api/getUser';
import postUser from './api/postUser';
import {login, verifyUserToken} from './api/auth';
import postPost from './api/postPost';
import getUserPosts from './api/getUserPosts';
import getFeed from './api/getFeed'
const bodyParser = require('body-parser');
const cors = require('cors');

const express = require('express');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors({
    origin: ['http://localhost:3000']
}));

app.use(function(req, res, next) {
    console.log('After CORS ' + req.method + ' ' + req.url);
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

app.post('/login', login)

app.get('/user', verifyUserToken, getUser)

app.post('/user', postUser)

// обновление пользователя
app.put('/user', () => { });
 
// удаление пользователя
app.delete('/users', );

// получить список друзей данного пользователя по uid
app.get('/friends', () => { });

// добавить друга
app.post('/friends', () => { });

// удалить друга
app.delete('/friends', () => { });

// получить посты данного пользователя
app.get('/userposts', verifyUserToken, getUserPosts);

// получить ленту постов
app.get('/feed', getFeed);

// опубликовать пост
app.post('/post', postPost);

// редактировать пост
app.put('/post', () => { });

// удалить пост
app.delete('/post', () => { });

// получить сообщения диалога
app.get('/message', () => { });

// написать сообщение
app.post('/message', () => { });


// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(`${__dirname}../../../client/build/index.html`));
// });

app.listen(PORT, () => console.log('сервер запустился'));