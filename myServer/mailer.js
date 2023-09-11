const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ufcstore141@gmail.com',
        pass: '12341234Gl'
    }
})

module.exports = transporter