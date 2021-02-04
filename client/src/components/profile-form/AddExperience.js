import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addExperience } from "../../actions/profile";
import Alert from "../layout/Alert";

const AddExperience = ({ addExperience, history }) => {
	const [formData, setFormData] = useState({
		title: "",
		company: "",
		location: "",
		from: "",
		to: "",
		current: false,
		description: ""
	});

	const [toDateDisabled, toggleDisabled] = useState(false);

	const {
		title,
		company,
		location,
		from,
		to,
		current,
		description
	} = formData;

	const handlChange = e =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	return (
		<section className="container">
			<Alert />
			<h1 className="large text-primary">Add An Job Experience</h1>
			<p className="lead">
				<i className="fas fa-code-branch"></i> Add any developer/programming
				positions that you have had in the past
			</p>
			<small>* = required field</small>
			<form
				className="form"
				onSubmit={e => {
					e.preventDefault();
					addExperience(formData, history);
				}}
			>
				<div className="form-group">
					<input
						type="text"
						placeholder="* Job Title"
						name="title"
						value={title}
						onChange={e => handlChange(e)}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="text"
						placeholder="* Company"
						name="company"
						value={company}
						onChange={e => handlChange(e)}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="text"
						placeholder="Location"
						name="location"
						value={location}
						onChange={e => handlChange(e)}
					/>
				</div>
				<div className="form-group">
					<h4>From Date</h4>
					<input
						type="date"
						name="from"
						value={from}
						onChange={e => handlChange(e)}
					/>
				</div>
				<div className="form-group">
					<p>
						<input
							type="checkbox"
							name="current"
							value={current}
							checked={current}
							onChange={e => {
								setFormData({ ...formData, current: !current });
								toggleDisabled(!toDateDisabled);
							}}
						/>{" "}
						Is it your Current Job?
					</p>
				</div>
				<div className="form-group">
					<h4>To Date</h4>
					<input
						type="date"
						name="to"
						value={to}
						onChange={e => handlChange(e)}
						disabled={toDateDisabled}
					/>
				</div>
				<div className="form-group">
					<textarea
						name="description"
						cols="30"
						rows="5"
						placeholder="Job Description"
						value={description}
						onChange={e => handlChange(e)}
					></textarea>
				</div>
				<input
					type="submit"
					className="btn btn-primary my-1"
					value="Submit"
				/>
				<Link className="btn btn-light my-1" to="/dashboard">
					Go Back
				</Link>
			</form>
		</section>
	);
};

AddExperience.propTypes = {
	addExperience: PropTypes.func.isRequired
};

export default connect(null, { addExperience })(AddExperience);
