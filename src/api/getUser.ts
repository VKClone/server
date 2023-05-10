import { DB } from '../utils/DB'

export default function getUser(req, res) {
    const db = new DB();
    db.execute(`select 
        uid, 
        first_name, 
        last_name, 
        login, 
        profile_description, 
        img_url 
    from user 
    where uid = ${req.query.uid}`)
        .then(data => data.results[0])
        .then(data => {
            if (!data) {
                res.status(404);
                res.send('Not found');
            }
            return data
        })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500);
            res.send(err)
        })
  }