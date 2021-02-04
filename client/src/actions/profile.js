import axios from "axios";
import { setAlert } from "./alert";
import {
	GET_PROFILE,
	PROFILE_ERROR,
	UPDATE_PROFILE,
	DELETE_EDU,
	DELETE_EXP,
	DELETE_ACCOUNT,
	LOGOUT,
	GET_PROFILES,
	GET_GITHUBREPOS,
	CLEAR_PROFILE
} from "./types";

// Get current user profile
export const getCurrentProfile = () => async dispatch => {
	dispatch({ type: CLEAR_PROFILE });
	try {
		const res = await axios.get("/api/profile/me");

		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status
			}
		});
	}
};

// Get users' profiles
export const getProfiles = () => async dispatch => {
	try {
		const res = await axios.get("/api/profile");

		dispatch({ type: GET_PROFILES, payload: res.data }); // payload should be array
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status
			}
		});
	}
};

// Get profile by user id
export const getProfileById = userId => async dispatch => {
	dispatch({ type: CLEAR_PROFILE });
	try {
		const res = await axios.get(`/api/profile/user/${userId}`);

		dispatch({ type: GET_PROFILE, payload: res.data }); // payload should be array
	} catch (err) {
		dispatch(setAlert(err.response.data.msg));

		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status
			}
		});
	}
};

// Get github repos
export const getGithubRepos = username => async dispatch => {
	try {
		const res = await axios.get(`/api/profile/github/${username}`);

		dispatch({
			type: GET_GITHUBREPOS,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status
			}
		});
	}
};

// Create or update profile
export const creatProfile = (
	formData,
	history,
	edit = false
) => async dispatch => {
	try {
		const res = await axios.post("/api/profile", formData);

		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});

		dispatch(
			setAlert(edit ? "Profile Updated" : "Profile Created", "success")
		);

		if (!edit) {
			history.push("/dashboard"); // action should use history.push instead of Redirect
		}
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.map(error => dispatch(setAlert(error.msg, "danger")));
		}

		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};

// Add experience
export const addExperience = (formData, history) => async dispatch => {
	try {
		const res = await axios.put("/api/profile/experience", formData);

		dispatch({ type: UPDATE_PROFILE, payload: res.data });
		dispatch(setAlert("Experience added!", "success"));
		history.push("/dashboard");
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.map(error => dispatch(setAlert(error.msg, "danger")));

			dispatch({
				type: PROFILE_ERROR,
				payload: {
					msg: err.response.statusText,
					status: err.response.status
				}
			});
		}
	}
};

// Add education
export const addEducation = (formData, history) => async dispatch => {
	try {
		const res = await axios.put("/api/profile/education", formData);

		dispatch({ type: UPDATE_PROFILE, payload: res.data });
		dispatch(setAlert("Education added!", "success"));
		history.push("/dashboard");
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.map(error => dispatch(setAlert(error.msg, "danger")));

			dispatch({
				type: PROFILE_ERROR,
				payload: {
					msg: err.response.statusText,
					status: err.response.status
				}
			});
		}
	}
};

// Delete one job experience
export const deleteExperience = jobId => async dispatch => {
	try {
		const res = await axios.delete(`/api/profile/experience/${jobId}`);

		dispatch({ type: DELETE_EXP, payload: res.data });
		dispatch(setAlert("Experience Deleted!", "success"));
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status
			}
		});
	}
};

// Delete one education history
export const deleteEducation = eduId => async dispatch => {
	try {
		const res = await axios.delete(`/api/profile/education/${eduId}`);

		dispatch({ type: DELETE_EDU, payload: res.data });
		dispatch(setAlert("Education Deleted!", "success"));
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status
			}
		});
	}
};

// Delete user account (posts and profile)
export const deleteUser = history => async dispatch => {
	if (
		window.confirm(
			"Your account will NOT be able to recover after remove!!! Are you sure?"
		)
	) {
		try {
			await axios.delete("/api/profile/");
			dispatch({ type: DELETE_ACCOUNT });
			dispatch({ type: LOGOUT });
			dispatch(setAlert("Your account is permanantly deleted!"));
			history.push("/login");
		} catch (err) {
			dispatch({
				type: PROFILE_ERROR,
				payload: {
					msg: err.response.statusText,
					status: err.response.status
				}
			});
		}
	}
};
