const db = require('./connection_db');

module.exports = function customerEdit(name, memberUpdateData) {
    let result = {};
    return new Promise((resolve, reject) => {
        db.all('UPDATE users SET name=:1,password = :2 WHERE name = :3', [memberUpdateData.name, memberUpdateData.password,name], function (err, rows) {
            if (err) {
                console.log(err);
                result.status = "會員資料更新失敗。"
                result.err = "伺服器錯誤，請稍後在試！"
                reject(result);
                return;
            }
            result.status = "會員資料更新成功。"
            result.memberUpdateData = memberUpdateData
            resolve(result)
        })
    })
}