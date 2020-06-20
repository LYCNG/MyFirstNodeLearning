//models data function called
const toRegister = require('../models/register_model');
const loginAction = require('../models/login_model')
const verify = require('../models/verification')
const hashPassword = require('../models/passwordhasher')
const updateAction = require('../models/update_model')

//other function 
const config = require('../config/development_config');//環境變數

const Check = require('../service/member_check');//格式檢驗
check = new Check();//檢查email是否符合格式

const jwt = require('jsonwebtoken');//import 模組


module.exports = class Member {
    //post申請的function   
    postRegister(req, res, next) {
        // 獲取client端資料
        const password = hashPassword(req.body.password);
        const memberData = {
            name: req.body.name,
            email: req.body.email,
            password: password
        }
        const checkEmail = check.checkEmail(memberData.email)
         // 不符合email格式
        if (checkEmail === false) {
            res.json({
                result: {
                    status: "註冊失敗。",
                    err: "請輸入正確的Eamil格式。(如1234@email.com)"
                }
            })
        // 若符合email格式
        }else if(checkEmail===true){
            console.log(memberData)
            // 將資料寫入資料庫
            toRegister(memberData).then(result => {
                // 若寫入成功則回傳
                res.json({
                    status: "註冊成功。",
                    result: result 
                })
            }, (err) => {
                // 若寫入失敗則回傳
                res.json({
                    result: err
                })
            })
        }
    }
    //post登入的function    
    postLogin(req, res,next) {
        const password = hashPassword(req.body.password)
        const memberData = {
            name: req.body.name,
            email: req.body.email,
            password: password
        }
        loginAction(memberData).then(rows => {
            if (check.checkNull(rows) === true) {
                res.json({
                    result: {
                        status: "登入失敗。",
                        err: "請輸入正確的帳號或密碼。"
                    }
                })
            } else if (check.checkNull(rows) === false) {
                console.log(rows)
                //產生token
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60), // token一個小時後過期。
                //將會員的id放進去token的生成規則中，如果會員想修改自己的資料，可以根據token來反推出是哪個會員的id，透過這個id就能指定資料庫要修改哪筆會員資料。
                    data: rows[0].name
                }, config.secret);
                res.setHeader('token', token);
                res.json({
                    result: {
                        status: "登入成功。",
                        loginMember: "歡迎 " + rows[0].name + " 的登入！",
                    }
                })
            }
        })
    }
    //post資料更新的function    
    postUpdate(req, res, next){
        const token = req.headers['token'];
    //確定token是否有輸入
        if (check.checkNull(token) === true) {
                res.json({
                err: "請輸入token！"
            })
        } else if (check.checkNull(token) === false) {
        verify(token).then(tokenResult => {
                if (tokenResult === false ) {
                    res.json({
                        result: {
                        status: "token錯誤。",
                        err: "請重新登入。"
                        }
                    })
                } else {
                    const name = tokenResult;//id為反驗證後的資料:name
                    const password = hashPassword(req.body.password);
                    const memberUpdateData = {
                        name: req.body.name,
                        password: password
                    }
                    console.log(Object.values(memberUpdateData))
                    updateAction(name, memberUpdateData).then(result => {
                        res.json({
                            result: result
                        })
                    }),(err)=>{
                        res.json({
                            result: err
                        })
                    }
                }
            })
        }
    }
}
