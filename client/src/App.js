import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./components/routing/PrivateRoute";
import CreateProfile from "./components/profile-form/CreateProfile";
import EditProfile from "./components/profile-form/EditProfile";
import AddExperience from "./components/profile-form/AddExperience";
import AddEducation from "./components/profile-form/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";
import NotFound from "./components/layout/NotFound";

//Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);

	return (
		<Provider store={store}>
			<Router>
				<Navbar />
				<Switch>
					<Route exact path="/" component={Landing} />
					<Route exact path="/profiles" component={Profiles} />
					<Route exact path="/register" component={Register} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/profile/:id" component={Profile} />
					<PrivateRoute
						exact
						path="/create-profile"
						component={CreateProfile}
					/>
					<PrivateRoute exact path="/dashboard" component={Dashboard} />
					<PrivateRoute
						exact
						path="/edit-profile"
						component={EditProfile}
					/>
					<PrivateRoute
						exact
						path="/add-experience"
						component={AddExperience}
					/>
					<PrivateRoute
						exact
						path="/add-education"
						component={AddEducation}
					/>
					<PrivateRoute exact path="/posts" component={Posts} />
					<PrivateRoute exact path="/posts/:id" component={Post} />
					<NotFound component={NotFound} />
				</Switch>
			</Router>
		</Provider>
	);
};

export default App;
