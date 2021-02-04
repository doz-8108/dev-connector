import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import Alert from "../layout/Alert";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { getPost } from "../../actions/post";
import PropTypes from "prop-types";

const Post = ({ getPost, post: { post, loading } }) => {
	const { id } = useParams();

	useEffect(() => {
		getPost(id);
	}, [getPost, id]);

	return (
		<section className="container">
			{loading || post === null ? (
				<Spinner />
			) : (
				<>
					<Alert />
					<Link to="/posts" className="btn">
						Back To Posts
					</Link>
					<div className="post bg-white p-1 my-1">
						<div>
							<Link to={`/profile/${post.user}`}>
								<img
									className="round-img"
									src={post.avatar}
									alt={post.name}
								/>
								<h4>{post.name}</h4>
							</Link>
						</div>
						<div>
							<p className="my-1">{post.text}</p>
						</div>
					</div>
					<CommentForm postId={post._id} />
					<div className="comments">
						{post.comments.map((comment, index) => (
							<Comment
								key={index}
								commentInfo={comment}
								postId={post._id}
							/>
						))}
					</div>
				</>
			)}
		</section>
	);
};

Post.propTypes = {
	getPost: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ post: state.post });

export default connect(mapStateToProps, { getPost })(Post);
