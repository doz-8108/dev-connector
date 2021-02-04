import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCurrentProfile, deleteUser } from "../../actions/profile";
import Alert from "../layout/Alert";
import Spinner from "../layout/Spinner";
import { DashboardAction } from "./DashboardAction";
import Experience from "./Experience";
import Education from "./Education";

const Dashboard = ({
	getCurrentProfile,
	auth: { user },
	profile: { profile, loading },
	deleteUser,
	history
}) => {
	useEffect(() => {
		getCurrentProfile();
	}, [getCurrentProfile]);

	return (
		<section className="container">
			{loading ? (
				<Spinner />
			) : (
				<>
					<Alert />
					<h1 className="large text-primary">Dashboard</h1>
					<p className="lead">
						<i className="fas fa-user"></i> Welcome {user && user.name}
					</p>
					{profile !== null ? (
						<>
							<DashboardAction />
							<Experience />
							<Education />

							<div className="my-2">
								<button
									className="btn btn-danger"
									onClick={() => deleteUser(history)}
								>
									<i className="fas fa-user-miuns"></i> Delete my
									Account
								</button>
							</div>
						</>
					) : (
						<>
							<p>
								You have not yet setup a profile please add some info
							</p>
							<Link
								to="/create-profile"
								className="btn btn-primary my-1"
							>
								Create Profile
							</Link>
						</>
					)}
				</>
			)}
		</section>
	);
};

Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	deleteUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteUser })(
	Dashboard
);
