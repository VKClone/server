const mysql = require('mysql2');
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;


const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'vk'
};

let connection;

function DBConnect() {
  connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error(`Ошибка подключения к базе данных: ${err}`);
      setTimeout(handleDisconnect, 1000);
    }
    console.log('Соединение с базой данных установлено!');
  });

  connection.on('error', (err) => {
    console.error(`Ошибка базы данных: ${err}`);
    DBConnect();
  });
}

DBConnect()

function request(query, res) { 
    connection.query(query, function(err, results) {
        if (err) {
            res.status(500);
            res.send('DB query error');
            console.error(err)
        }
        else if (results.length === 0) {
            res.status(404);
            res.send('Not found');
        }
        else {
            res.send(results)
        };
    });
}

function insert(query, res) { 
    connection.query(query, function(err, results) {
        if (err) {
            res.status(500);
            res.send('DB query error');
            console.error(err)
        }
        else if (results.length === 0) {
            res.status(404);
            res.send('Not found');
        }
        else {
            res.send(results)
        };
    });
}

app.post('auth', (req, res) => {
    // TODO
})

// информация о пользователе
app.get('/user', (req, res) => {
  request(`select 
        uid, 
        first_name, 
        last_name, 
        login, 
        profile_description, 
        img_url 
    from user 
    where uid = ${req.query.uid}`, res);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// добавление пользователя
app.post('/user', (req, res) => {
    b = req.body;
    
    request(`insert into user(
        first_name, 
        last_name, 
        login, 
        profile_description, 
        img_url,
        password
    ) values (
        '${b.first_name}',
        '${b.last_name}',
        '${b.login}',
        '${b.profile_description}',
        '${b.img_url}',
        '${hashStringWithSalt(b.password, 'saldkh')}'
    )`, res);
});

// обновление пользователя
app.put('/user', (req, res) => {
    // TODO
});

// удаление пользователя
app.delete('/users', (req, res) => {
  // TODO
});

// получить список друзей данного пользователя по uid
app.get('/friends', (req, res) => {
    // TODO
});

// добавить друга
app.post('/friends', (req, res) => {
    // TODO
});

// удалить друга
app.delete('/friends', (req, res) => {
    // TODO
});

// получить посты данного пользователя
app.get('/userposts', (req, res) => {
    // TODO
});

// получить ленту постов
app.get('/feed', (req, res) => {
    // TODO
});

// опубликовать пост
app.post('/post', (req, res) => {
    // TODO
});

// редактировать пост
app.put('/post', (req, res) => {
    // TODO
});

// удалить пост
app.delete('/post', (req, res) => {
    // TODO
});

// получить сообщения диалога
app.get('/message', (req, res) => {
    // TODO
});

// написать сообщение
app.post('/message', (req, res) => {
    // TODO
});



function hashStringWithSalt(string, salt) {
  const hash = crypto.createHmac('sha256', salt)
                    .update(string)
                    .digest('hex');
  return hash;
}

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
