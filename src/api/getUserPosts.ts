import { DB } from '../utils/DB'

export default function getUserPosts(req, res) {
    const db = new DB();
    db.execute(`select pid, uid, first_name, last_name, img_url, DATE_FORMAT(date, '%d/%m/%y %r') date, content, imgUrl
    from post join user
    on post.authorId = user.uid
    where uid = ${req.query.uid}
    order by post.date desc
    LIMIT ${req.query.page*5},5`)
        .then(data => data.results)
        .then(data => {
            if (!data.length) {
                res.status(404);
                res.send('Not found');
            }
            else res.send(data)
        })
        .catch(err => {
            res.status(500);
            res.send(err)
        })
  }