import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addEducation } from "../../actions/profile";
import Alert from "../layout/Alert";

const AddEducation = ({ addEducation, history }) => {
	const [formData, setFormData] = useState({
		degree: "",
		school: "",
		fieldofstudy: "",
		from: "",
		to: "",
		current: false,
		description: ""
	});

	const [toDateDisabled, toggleDisabled] = useState(false);

	const {
		degree,
		school,
		fieldofstudy,
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
			<h1 className="large text-primary">Add Your Education History</h1>
			<p className="lead">
				<i className="fas fa-code-branch"></i> Add any School/bootcamp that
				you have had in the past
			</p>
			<small>* = required field</small>
			<form
				className="form"
				onSubmit={e => {
					e.preventDefault();
					addEducation(formData, history);
				}}
			>
				<div className="form-group">
					<input
						type="text"
						placeholder="* Degree"
						name="degree"
						value={degree}
						onChange={e => handlChange(e)}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="text"
						placeholder="* School or Bootcamp"
						name="school"
						value={school}
						onChange={e => handlChange(e)}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="text"
						placeholder="Field of Study"
						name="fieldofstudy"
						value={fieldofstudy}
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
						Are you still studying?
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
						placeholder="Program Description"
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

AddEducation.propTypes = {
	addEducation: PropTypes.func.isRequired
};

export default connect(null, { addEducation })(AddEducation);
