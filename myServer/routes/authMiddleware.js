const { decrypt } = require('../cryptoUtil')

module.exports = (req, res, next) => {
    const encryptedUserData = req.cookies.userData
    if (!encryptedUserData) {
        res.clearCookie('userData')
        return res.status(401).send('Not authenticated')
    }

    try {
        const decryptedData = JSON.parse(decrypt(encryptedUserData))
        
        if (req.session.userId !== decryptedData.userId) {
            return res.status(401).send('Session mismatch')
        }
        
        req.user = decryptedData
        next()
    } catch (err) {
        return res.status(401).send('Not authenticated')
    }
}