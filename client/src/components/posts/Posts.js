import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PostItem from "./PostItem";
import PostFrom from "./PostForm";
import { getPosts } from "../../actions/post";
import Alert from "../layout/Alert";
import Spinner from "../layout/Spinner";

const Posts = ({ getPosts, post: { posts, loading } }) => {
	useEffect(() => {
		getPosts();
	}, [getPosts]);

	return loading ? (
		<Spinner />
	) : (
		<section className="container">
			<Alert />

			<h1 className="large text-primary">Posts</h1>
			<p className="lead">
				<i className="fas fa-user"></i> Welcome to the community
			</p>

			<PostFrom />

			<div className="posts">
				{posts.length > 0 ? (
					posts.map(post => <PostItem key={post._id} post={post} />)
				) : (
					<h1>No post found.</h1>
				)}
			</div>
		</section>
	);
};

Posts.propTypes = {
	post: PropTypes.object.isRequired,
	getPosts: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ post: state.post });

export default connect(mapStateToProps, { getPosts })(Posts);
