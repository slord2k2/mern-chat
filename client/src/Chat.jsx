import { useEffect, useState, useRef, useContext } from "react";
import Logo from "./Logo";
import { uniqBy } from "lodash";
import { UserContext } from "./UserContext";
import axios from "axios";
import Contact from "./Contact";

export default function Chat() {
	const [ws, setWs] = useState(null);
	const [onlinePeople, setOnlinePeople] = useState([]);
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [newMessageText, setNewMessageText] = useState("");
	const [messages, setMessages] = useState([]);
	const [offlinePeople, setOfflinePeople] = useState([]); // [
	const { username, id } = useContext(UserContext);
	const divUnderMessages = useRef(null);


	// connecting to the websocket
	useEffect(() => {
		connectToWs(); // connecting to the websocket
	}, []);
	// helper function to connect to the websocket
	function connectToWs() {
		const ws = new WebSocket("ws://localhost:3000");
		setWs(ws);
		ws.addEventListener("message", handleMessage); // listening to the messages
		ws.addEventListener("close", () => {
			setTimeout(() => {
				console.log("Disconnected, trying to reconnect");
				connectToWs();
			}, 1000);
		});
	}

	// helper function to show online people
	function showOnlinePeople(peopleArray) {
		const people = {};
		peopleArray.forEach(({ userId, username }) => {
			people[userId] = username;
		});
		setOnlinePeople(people);
	}
	// to show usernames of online people
	function handleMessage(ev) {
		const messageData = JSON.parse(ev.data);
		console.log({ ev, messageData });
		if ("online" in messageData) {
			showOnlinePeople(messageData.online);
		} else if ("text" in messageData) {
			setMessages((prev) => [...prev, { ...messageData }]);
		}
	}
	// function triggered when the form(submit) is submitted to send message.
	function sendMessage(ev) {
		ev.preventDefault();
		ws.send(
			JSON.stringify({
				recipient: selectedUserId,
				text: newMessageText,
			})
		);
		setNewMessageText("");
		setMessages((prev) => [
			...prev,
			{
				text: newMessageText,
				sender: id,
				recipient: selectedUserId,
				isOur: true,
				_id: Date.now(),
			},
		]);
	}
	useEffect(() => {
		const div = divUnderMessages.current;
		if (div) div.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [messages]);
	useEffect(() => {
		if (selectedUserId) {
			axios.get('/messages/'+selectedUserId).then(res=>{
				setMessages(res.data);
			}); // get messages from the server
		}
	}, [selectedUserId]);

	useEffect(() => {
		axios.get('/people').then(res=>{
			const offlinePeopleArr= res.data.filter(p=>p._id !== id).filter(p=> !Object.keys(onlinePeople).includes(p._id));
			const offlinePeople = {};
			offlinePeopleArr.forEach((p) => {
				offlinePeople[p._id] = p;
			});
			setOfflinePeople(offlinePeople)
			// console.log({offlinePeople,offlinePeopleArr});
		});
	},[onlinePeople])

	// deleting our user from onlinePeople
	const onlinePeopleExcludingOurUser = { ...onlinePeople };
	delete onlinePeopleExcludingOurUser[id];

	const messagesWithoutDupes = uniqBy(messages, "_id");

	return (
		<div className="flex h-screen">
			<div className="bg-white w-1/3">
				<Logo />
				{Object.keys(onlinePeopleExcludingOurUser).map((userId) => (
					// eslint-disable-next-line react/jsx-key
					<Contact
						key={userId}
						id={userId}
						online={true}
						username={onlinePeopleExcludingOurUser[userId]}
						onClick={()=>setSelectedUserId(userId)}
						selected={selectedUserId === userId}
					/>
				))}
				{Object.keys(offlinePeople).map((userId) => (
					// eslint-disable-next-line react/jsx-key
					<Contact
						key={userId}
						id={userId}
						online={false}
						username={offlinePeople[userId].username}
						onClick={()=>setSelectedUserId(userId)}
						selected={selectedUserId === userId}
					/>
				))}
			</div>

			<div className="flex flex-col bg-blue-50 w-2/3 p-2">
				<div className="flex-grow">
					{!selectedUserId && (
						<div className="flex h-full flex-grow  items-center justify-center">
							<div className="text-gray-300">&larr; Select Chat</div>
						</div>
					)}
					{!!selectedUserId && (
						<div className="mb-4 h-full">
							<div className="relative h-full ">
								<div className=" overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
									{messagesWithoutDupes.map((message) => (
										<div
											key={message._id}
											className={
												message.sender === id ? "text-right" : "text-left"
											}
										>
											<div
												className={
													"text-left inline-block p-2 my-2 rounded-md text-sm " +
													(message.sender === id
														? "bg-blue-500 text-white"
														: "bg-white text-gray-500")
												}
											>
												{message.text}
											</div>
										</div>
									))}
									<div ref={divUnderMessages}></div>
								</div>
							</div>
						</div>
					)}
				</div>
				{!!selectedUserId && (
					<form className="flex gap-2" onSubmit={sendMessage}>
						<input
							type="text"
							value={newMessageText}
							onChange={(ev) => setNewMessageText(ev.target.value)}
							placeholder="Type your message here"
							className="bg-white border p-2 flex-grow"
						/>
						<button
							type="submit"
							className="bg-blue-500 p-2 text-white rounded-sm"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
								/>
							</svg>
						</button>
					</form>
				)}
			</div>
		</div>
	);
}
