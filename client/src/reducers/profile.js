import {
	GET_PROFILE,
	GET_PROFILES,
	PROFILE_ERROR,
	CLEAR_PROFILE,
	UPDATE_PROFILE,
	DELETE_EDU,
	DELETE_EXP,
	DELETE_ACCOUNT,
	GET_GITHUBREPOS
} from "../actions/types";

const initialState = {
	loading: true,
	profile: null, // Single user profile
	profiles: [], // A list of other user's profiles
	repos: [],
	error: {}
};

export default (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case GET_PROFILE:
		case DELETE_EDU:
		case DELETE_EXP:
		case UPDATE_PROFILE:
			return {
				...state,
				profile: payload,
				loading: false
			};
		case GET_PROFILES:
			return {
				...state,
				profiles: payload,
				respos: [],
				loading: false
			};
		case PROFILE_ERROR:
			return {
				...state,
				error: payload,
				loading: false,
				repos: []
			};
		case GET_GITHUBREPOS:
			return {
				...state,
				repos: payload,
				loading: false
			};
		case CLEAR_PROFILE:
			return { ...state, profile: null, repos: [], loading: true };
		case DELETE_ACCOUNT:
			return initialState;
		default:
			return state;
	}
};
