const { decrypt } = require('../cryptoUtil')

module.exports = (req, res, next) => {
   const token = req.cookies.userData
   if (!token) return res.status(401).send('Not authenticated')

   try {
      const decryptedData = JSON.parse(decrypt(token))
      req.user = decryptedData
      next()
   } catch (err) {
      return res.status(401).send('Not authenticated')
   }
}