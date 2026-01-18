import jwt from "jsonwebtoken";

export const varifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log(err);

    return res.status(401).json({ message: "Invalid Token or Token Expired" });
  }
};