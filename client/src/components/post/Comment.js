import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { deleteComment } from "../../actions/post";
import Moment from "react-moment";
import PropTypes from "prop-types";

const Comment = ({
	postId,
	commentInfo: {
		name,
		text,
		avatar,
		date,
		user: commentUserId,
		_id: commentId
	},
	auth: {
		isAuthenticated,
		loading,
		user: { _id: currentLogInId }
	},
	deleteComment
}) => {
	return (
		<div className="post bg-white p-1 my-1">
			<div>
				<Link to={`/profile/${commentUserId}`}>
					<img className="round-img" src={avatar} alt={name} />
					<h4>{name}</h4>
				</Link>
			</div>
			<div>
				<p className="my-1">{text}</p>
				<p className="post-date">
					Posted on {<Moment format="YYYY/MM/DD">{date}</Moment>}
				</p>
				{isAuthenticated && !loading && currentLogInId === commentUserId && (
					<button
						type="button"
						className="btn btn-danger"
						onClick={() => deleteComment(postId, commentId)}
					>
						<i className="fas fa-times"></i>
					</button>
				)}
			</div>
		</div>
	);
};

Comment.propTypes = {
	currentPost: PropTypes.object.isRequired,
	commentInfo: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	deleteComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ auth: state.auth });

export default connect(mapStateToProps, { deleteComment })(Comment);
