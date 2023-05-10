const crypto = require('crypto');

export function hashPassword(string:string, salt:string):string {
    const hash = crypto.createHmac('sha256', salt)
                        .update(string)
                        .digest('hex');
    return hash;
}
  