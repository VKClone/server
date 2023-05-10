const mysql = require('mysql');

interface IDB {
    execute(query: string): Promise<any>;
}

export class DB implements IDB {
  private connection;
  private static instance: DB;

  private config = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'vk',
  };

  private autoConnect() {
    this.connection = mysql.createConnection(this.config);

    this.connection.connect((err) => {
      if (err) {
        setTimeout(this.autoConnect, 2000);
      }
    });

    this.connection.on('error', (err) => {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') this.autoConnect();
    });
  }

  constructor() {
    if (DB.instance) {
        return DB.instance;
    }
    this.autoConnect();
    DB.instance = this;
  }

  public execute(query: string): any {
    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, results, fields) => {
        if (error) reject(error);
        resolve({ error, results, fields });
      });
    });
  }
}