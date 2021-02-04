import axios from "axios";

const setAuthToken = token => {
	// token got from register / login will be set to header for request
	if (token) {
		axios.defaults.headers.common["x-auth-token"] = token;
	} else {
		delete axios.defaults.headers.common["x-auth-token"];
	}
};

export default setAuthToken;
