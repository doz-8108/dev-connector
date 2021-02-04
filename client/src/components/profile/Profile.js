import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getProfileById } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub";
import PropTypes from "prop-types";

const Profile = ({ getProfileById, auth, profile: { profile, loading } }) => {
	const { id } = useParams();
	useEffect(() => {
		getProfileById(id);
	}, []);

	return (
		<section className="container">
			{profile === null || loading ? (
				<Spinner />
			) : (
				<>
					<Link to="/profiles" className="btn btn-light">
						Back to profiles
					</Link>
					{auth.isAuthenticated && !auth.loading && id === auth.user._id && (
						<Link to="/edit-profile" className="btn btn-dark">
							Edit Profile
						</Link>
					)}
					<div className="profile-grid my-1">
						<ProfileTop profile={profile} />
						<ProfileAbout profile={profile} />
						<div className="profile-exp bg-white p-2">
							<h2 className="text-primary">Experience</h2>
							{profile.experience.length > 0 ? (
								profile.experience.map(exp => (
									<ProfileExperience key={exp._id} experience={exp} />
								))
							) : (
								<h4>No experience credentials</h4>
							)}
						</div>
						<div className="profile-edu bg-white p-2">
							<h2 className="text-primary">Education</h2>
							{profile.education.length > 0 ? (
								profile.education.map(edu => (
									<ProfileEducation education={edu} key={edu._id} />
								))
							) : (
								<h4>No education credentials</h4>
							)}
						</div>
					</div>

					{profile.githubusername && (
						<ProfileGithub username={profile.githubusername} />
					)}
				</>
			)}
		</section>
	);
};

Profile.propTypes = {
	getProfileById: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	profile: state.profile,
	auth: state.auth // If the viewing profile matches user profile they will be able to edit the profile
});

export default connect(mapStateToProps, { getProfileById })(Profile);
