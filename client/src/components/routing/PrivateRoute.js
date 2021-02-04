import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const PrivateRoute = ({
	component: Component,
	isAuthenticated,
	loading,
	...rest
}) => (
	<Route
		{...rest}
		render={props =>
			!isAuthenticated && !loading ? (
				<Redirect to="/login" />
			) : (
				<Component {...props} />
			)
		}
	/>
);

PrivateRoute.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.isAuthenticated,
		loading: state.auth.loading
	};
};

export default connect(mapStateToProps)(PrivateRoute);
