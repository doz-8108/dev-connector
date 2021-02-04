import axios from "axios";
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	CLEAR_PROFILE
} from "./types";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";

// Load user if token there is local token
export const loadUser = () => async dispatch => {
	if (localStorage.token) {
		// if sign up / sign in success ===> localStorage.setItem("token", ....)
		setAuthToken(localStorage.token);
	}

	try {
		const res = await axios.get("/api/auth");

		dispatch({
			type: USER_LOADED,
			payload: res.data // res.data stores the res.json(...) response
		});
	} catch (err) {
		dispatch({ type: AUTH_ERROR });
	}
};

// Reg user
export const register = ({ name, email, password }) => async dispatch => {
	try {
		const res = await axios.post("/api/users", { name, email, password });

		dispatch({
			type: REGISTER_SUCCESS,
			payload: res.data
		});

		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.map(error => dispatch(setAlert(error.msg, "danger"))); // errors array from express-validator
		}

		dispatch({
			type: REGISTER_FAIL
		});
	}
};

// higher order function that return a function take the dispatch dispatch as a parameter
// p.s export default connect(mapDispatchToProps(dispatch) {
//         return {must be a object here} <-- put the above function directly inside the brackets to dispatch
//     })(component);

// Login User
export const login = ({ email, password }) => async dispatch => {
	// redux-thunk provide dispatch and getState and also allows return function (async stuff)
	try {
		const res = await axios.post("/api/auth", { email, password });

		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data
		});

		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.map(error => dispatch(setAlert(error.msg, "danger"))); // errors array from express-validator
		}

		dispatch({
			type: LOGIN_FAIL
		});
	}
};

// Logout
export const logout = () => dispatch => {
	dispatch({ type: LOGOUT });
	dispatch({ type: CLEAR_PROFILE });
};
