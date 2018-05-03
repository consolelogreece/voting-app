import jwt from 'jsonwebtoken'

export const generateJWT = (username) => {
	return jwt.sign({username:username}, process.env.JWT_SECRET);
}

export const verifyJWT = (token) => {

	return new Promise ((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				reject(null)
			} else {
				resolve(decoded.username)
			}
			
		});
	});
}
