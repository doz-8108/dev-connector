import {
	DELETE_POST,
	GET_POSTS,
	POST_ERROR,
	UPDATE_LIKE,
	ADD_POST,
	GET_POST,
	ADD_COMMENT,
	DELETE_COMMENT
} from "../actions/types";

const initialState = {
	posts: [],
	post: null,
	loading: true,
	error: {}
};

export default (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case GET_POSTS:
			return {
				...state,
				posts: payload,
				loading: false
			};
		case GET_POST:
			return {
				...state,
				post: payload,
				loading: false
			};
		case POST_ERROR:
			return {
				...state,
				error: payload,
				loading: false
			};
		case UPDATE_LIKE:
			return {
				...state,
				posts: state.posts.map(post =>
					post._id === payload.postId
						? { ...post, likes: payload.likes }
						: post
				),
				loading: false
			};
		case ADD_POST:
			return {
				...state,
				posts: payload,
				loading: false
			};
		case DELETE_POST:
			return {
				...state,
				posts: payload,
				loading: false
			};
		case DELETE_COMMENT: // Same, they both update the comment array
		case ADD_COMMENT:
			return {
				...state,
				post: { ...state.post, comments: payload },
				loading: false
			};
		default:
			return state;
	}
};
