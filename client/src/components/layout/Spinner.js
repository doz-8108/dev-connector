import React from "react";
import spinnerGif from "./spinner.gif";

const Spinner = () => (
	<>
		<img
			src={spinnerGif}
			alt="Loading..."
			style={{ width: "200px", margin: "auto", display: "block" }}
		/>
	</>
);

export default Spinner;
