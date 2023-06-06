// eslint-disable-next-line react/prop-types
export default function Form({isLoginOrRegister,username,setUsername,password,setPassword,error,setError,setIsLoginOrRegister,
}) {
	return (
		<div className="mt-10 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-16 xl:px-24 xl:max-w-2xl">
			<h2
				className="text-center text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl
                    					xl:text-bold"
			>
				{isLoginOrRegister === "Register" ? "Sign up" : "Log in"}
			</h2>
			<div className="mt-12">
				<div>
					<div className="text-sm font-bold text-gray-700 tracking-wide">
						Username
					</div>
					<input
						className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
						value={username}
						onChange={(ev) => setUsername(ev.target.value)}
						type="text"
						placeholder="mike@gmail.com"
					/>
				</div>
				<div className="mt-8">
					<div className="flex justify-between items-center">
						<div className="text-sm font-bold text-gray-700 tracking-wide">
							Password
						</div>
					</div>
					<input
						value={password}
						onChange={(ev) => setPassword(ev.target.value)}
						className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
						type="password"
						placeholder="Enter your password"
					/>
				</div>
				{error && (
					<div
						className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-2 p-2 mb-2"
						role="alert"
					>
						<strong className="font-bold">Holy smokes! </strong>
						<span className="block sm:inline">{error}</span>
						<span className="absolute top-0 bottom-0 right-0 px-4 py-3">
							<svg
								className="fill-current my-2 h-6 w-6 text-red-500"
								onClick={() => setError(null)}
								role="button"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<title className="">Close</title>
								<path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
							</svg>
						</span>
					</div>
				)}
				<div className="mt-10">
					<button
						className="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide
                                font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                shadow-lg"
					>
						{isLoginOrRegister === "Register" ? "Sign up" : "Log in"}
					</button>
				</div>

				<div className="mt-12 text-sm font-display font-semibold text-gray-700 text-center">
					{isLoginOrRegister === "Register" && (
						<div>
							Already have an account ?{" "}
							<button
								onClick={() => setIsLoginOrRegister("login")}
								className="cursor-pointer text-indigo-600 hover:text-indigo-800"
							>
								Log in
							</button>
						</div>
					)}
					{isLoginOrRegister === "login" && (
						<div>
							Don&apos;t have an account ?{" "}
							<button
								onClick={() => setIsLoginOrRegister("Register")}
								className="cursor-pointer text-indigo-600 hover:text-indigo-800"
							>
								Sign up
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
