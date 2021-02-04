import React from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";

const ProfileExperience = ({
	experience: { title, company, from, to, description }
}) => {
	return (
		<div>
			<h3 className="text-dark">{company}</h3>
			<p>
				<Moment format="YYYY/MM/DD">{from}</Moment>-{" "}
				{!to ? " Now" : <Moment format="YYYY/MM/DD">{to}</Moment>}
			</p>
			<p>
				<strong>Position: </strong>
				{title}
			</p>
			<p>
				<strong>Description: </strong>
				<span>{description}</span>
			</p>
		</div>
	);
};

ProfileExperience.propTypes = {
	experience: PropTypes.object.isRequired
};

export default ProfileExperience;
