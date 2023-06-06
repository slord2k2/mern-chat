// eslint-disable-next-line react/prop-types
export default function Logout({ username, logout}) {
    return (
        <div className="flex items-center justify-between mx-5 my-2">
					<div className="flex items-center cursor-pointer">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-6 h-6 mx-2"
						>
							<path
								fillRule="evenodd"
								d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
								clipRule="evenodd"
							/>
						</svg>

						<span className="text-gray-700 text-lg">
							{username.charAt(0).toUpperCase() +
								username.slice(1).toLowerCase()}
						</span>
					</div>
					<button
						onClick={logout}
						className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2  rounded"
					>
						Logout
					</button>
				</div>
    );
}