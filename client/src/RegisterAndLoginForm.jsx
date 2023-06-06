import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function RegisterAndLoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [isLoginorRegister, setIsLoginorRegister] = useState("Register");
	const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

	async function handleSubmit(ev) {
		ev.preventDefault();
		const url = isLoginorRegister === "Login" ? "/login" : "/register";

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
		<div className="bg-blue-100 h-screen flex items-center">
			<form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
				<input
					value={username}
					onChange={(ev) => setUsername(ev.target.value)}
					className="block w-full rounded-sm p-2 mb-2 border"
					type="text"
					placeholder="username"
				/>
				<input
					value={password}
					onChange={(ev) => setPassword(ev.target.value)}
					className="block w-full rounded-sm p-2 mb-2 border"
					type="password"
					placeholder="password"
				/>
				{error && (
					// <div className="text-center text-red-500">
					// 	<p className="text-sm">{error}</p>
					// </div>
					<div
						className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative p-2 mb-2"
						role="alert"
					>
						<strong className="font-bold">Holy smokes!</strong>
						<span className="block sm:inline">{error}</span>
						<span className="absolute top-0 bottom-0 right-0 px-4 py-3">
							<svg
								className="fill-current h-6 w-6 text-red-500"
								onClick={() => setError(null)}
								role="button"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<title>Close</title>
								<path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
							</svg>
						</span>
					</div>
				)}
				<button className="bg-blue-500 p-2 text-white block w-full rounded-sm">
					{isLoginorRegister === "Register" ? "Register" : "Login"}
				</button>
				<div className="text-center mt-2">
					{isLoginorRegister === "Register" && (
						<div className="my-2">
							Already a member?
							<button
								className="my-2 mx-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
								onClick={() => setIsLoginorRegister("Login")}
							>
								Login here
							</button>
						</div>
					)}
					{isLoginorRegister === "Login" && (
						<div>
							Do not have an account?
							<button
								className="my-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
								onClick={() => setIsLoginorRegister("Register")}
							>
								Register here
							</button>
						</div>
					)}
				</div>
			</form>
		</div>
	);
}
