/* eslint-disable react/no-unknown-property */
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import Header from "./utils/Header";
import Footer from "./utils/Footer";
import Form from "./Form";

export default function RegisterAndLoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
	const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

	async function handleSubmit(ev) {
		ev.preventDefault();
		const url = isLoginOrRegister === "login" ? "/login" : "/register";

		try {
			const response = await axios.post(url, { username, password });
			const data = response.data;

			if (data.alert) {
				// Display the error message to the user
				setError(data.alert);
			} else {
				// Registration or login was successful
				setLoggedInUsername(username);
				setId(data.id);
				// Perform any additional actions or redirects
			}
		} catch (error) {
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				setError(error.response.data.alert || "Something went wrong!");
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser
				setError("No response from the server");
			} else {
				// Something else happened while setting up the request
				setError("Error occurred while processing the request");
			}
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="lg:flex">
				<div className="lg:w-1/2 xl:max-w-screen-sm">
					<Header />
					<Form
						isLoginOrRegister={isLoginOrRegister}
						username={username}
						setUsername={setUsername}
						password={password}
						setPassword={setPassword}
						error={error}
						setError={setError}
						setIsLoginOrRegister={setIsLoginOrRegister}
					/>
				</div>
				<Footer/>
			</div>
		</form>
	);
}
