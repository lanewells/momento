const jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Authorization header missing." })
    }

    const token = req.headers.authorization.split(" ")[1]
    if (!token) {
      return res.status(401).json({ error: "Authorization token missing." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded

    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Authorization token has expired." })
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid authorization token." })
    }

    res.status(500).json({ error: "An error occurred during authorization." })
  }
}

module.exports = verifyToken
