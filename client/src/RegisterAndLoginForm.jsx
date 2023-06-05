import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function RegisterAndLoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLoginorRegister, setIsLoginorRegister] = useState("Register"); // [1
	const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
	async function handleSubmit(ev) {
		ev.preventDefault();
		const url= isLoginorRegister === "Login" ? "/login" : "/register";

		const { data } = await axios.post(url, { username, password });
		setLoggedInUsername(username);
		setId(data.id);
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
				<button className="bg-blue-500 p-2 text-white block w-full rounded-sm">
					{isLoginorRegister === "Register" ? "Register" : "Login"}
				</button>
				<div className="text-center mt-2">
					{isLoginorRegister === "Register" && (
						<div>
							Already a member?
							<button onClick={() => setIsLoginorRegister("Login")}>
								Login here
							</button>
						</div>
					)}
					{isLoginorRegister === "Login" && (
						<div>
							Don't have an account?
							<button onClick={() => setIsLoginorRegister("Register")}>
								Register here
							</button>
						</div>
					)}
				</div>
			</form>
		</div>
	);
}
