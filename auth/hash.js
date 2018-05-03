import bcrypt from 'bcrypt';


export const createHash = password => {

	return new Promise ((resolve, reject) => {

  		let saltRounds = 10	
		bcrypt.hash(password, saltRounds, (err, hash) => {
  			if (err) {
  				reject(err)
  			} else {
  				resolve(hash)
  			}

		});
  	})
}


export const compareHash = (plainTextPassword, passwordHash) => {
	return new Promise ((resolve, reject) => {
		bcrypt.compare(plainTextPassword, passwordHash).then((res) => {
			resolve(res);
		});

	})
		
}



