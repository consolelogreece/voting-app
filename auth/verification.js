export const verifyPasswordIntegrity = (credentials) => {
	if (credentials.password !== credentials.confirmPassword) {
		return false;	
	}
	return true;
}


export const verifyFieldsFilled = (credentials) => {
	if (credentials.email === "" || credentials.username === "" || credentials.password === "" ) {
		return false;
	}
	return true;
}