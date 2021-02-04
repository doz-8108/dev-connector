import React, { useState } from "react";
import { connect } from "react-redux";
import { addComment } from "../../actions/post";
import PropTypes from "prop-types";

const CommentForm = ({ addComment, postId }) => {
	const [formData, setFormData] = useState("");

	return (
		<div className="post-form">
			<div className="bg-primary p">
				<h3>Leave A Comment</h3>
			</div>
			<form
				className="form my-1"
				onSubmit={e => {
					e.preventDefault();
					addComment(formData, postId);
					setFormData("");
				}}
			>
				<textarea
					name="text"
					cols="30"
					rows="5"
					placeholder="Comment on this post"
					value={formData}
					onChange={e => setFormData(e.target.value)}
					required
				></textarea>
				<input type="submit" className="btn btn-dark my-1" value="Submit" />
			</form>
		</div>
	);
};

CommentForm.propTypes = {
	postId: PropTypes.string.isRequired,
	addComment: PropTypes.func.isRequired
};

export default connect(null, { addComment })(CommentForm);
