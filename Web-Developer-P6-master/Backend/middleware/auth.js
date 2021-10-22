const jwt = require("jsonwebtoken");

const getToken = (req, res) => {
  const signedCookie = () => req.signedCookie["token"];
  const authHeader = () => {
    const auth = req.headers.authorization;

    if (auth) {
      if (!auth.startsWith("Bearer ")) {
        throw new Error("Missing token");
      }

      return auth.slice(7);
    }

    return undefined;
  };

  try {
    const rawToken = authHeader() || signedCookie() || null; //autHeader à la priorité, si déjà un cookie il sera écrasé
    if (!rawToken) {
      throw new Error("Missing token");
    }
    const token = jwt.verify(rawToken, process.env.ACCESS_TOKEN_SECRET);
    res.setHeader("Set-Cookie", `token=${rawToken}; HttpOnly`);
    return token;
  } catch (err) {
    res.status(401).json({ error: err });
    return null;
  }
};

module.exports = (req, res, next) => {
  const result = getToken(req, res);

  if (result !== null) {
    req.userId = result.userId;
    next();
  }
};
