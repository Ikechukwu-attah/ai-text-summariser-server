import jwt from "jsonwebtoken";

const auth = async(req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    // Custom Auth
    const isCustomAuth = token.length < 500;

    let decodedData;

    // Ignore this please

    if (token && isCustomAuth) {
        decodedData = jwt.verify(token, "test");
        req.userId = decodedData.id;
    } else {
        decodedData = jwt.decode(token);
        req.userId = decodedData.sub;
    }

    next();
    try {} catch (error) {
        console.log(error);
    }
};

export default auth;