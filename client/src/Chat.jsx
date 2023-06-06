import { useEffect, useState, useRef, useContext } from "react";
import Header from "./utils/Header";
import { uniqBy } from "lodash";
import { UserContext } from "./UserContext";
import axios from "axios";
import MessageTypeBox from "./utils/MessageTypeBox";
import Peoples from "./utils/Peoples";
import LogoutButton from "./utils/LogoutButton";
import ChatBox from "./utils/ChatBox";

export default function Chat() {
	const [ws, setWs] = useState(null);
	const [onlinePeople, setOnlinePeople] = useState([]);
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [newMessageText, setNewMessageText] = useState("");
	const [messages, setMessages] = useState([]);
	const [offlinePeople, setOfflinePeople] = useState([]); // [
	const { username, id, setId, setUsername } = useContext(UserContext);
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
			if(messageData.sender === selectedUserId)
			{
				setMessages((prev) => [...prev, { ...messageData }]);
		}}
	}

	// logout function
	function logout() {
		axios.post("/logout").then(() => {
			setWs(null);
			setId(null);
			setUsername(null);
		});
	}

	// function triggered when the form(submit) is submitted to send message.
	function sendMessage(ev, file = null) {
		if (ev) ev.preventDefault();
		ws.send(
			JSON.stringify({
				recipient: selectedUserId,
				text: newMessageText,
				file,
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
		if (file) {
			axios.get("/messages/" + selectedUserId).then((res) => {
				setMessages(res.data);
			});
		}
	}

	function sendFile(ev) {
		const reader = new FileReader(ev);
		reader.readAsDataURL(ev.target.files[0]);
		reader.onload = () => {
			sendMessage(null, {
				name: ev.target.files[0].name,
				data: reader.result,
			});
		};
	}

	useEffect(() => {
		const div = divUnderMessages.current;
		if (div) div.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [messages]);
	useEffect(() => {
		if (selectedUserId) {
			axios.get("/messages/" + selectedUserId).then((res) => {
				setMessages(res.data);
			}); // get messages from the server
		}
	}, [selectedUserId]);

	useEffect(() => {
		axios.get("/people").then((res) => {
			const offlinePeopleArr = res.data
				.filter((p) => p._id !== id)
				.filter((p) => !Object.keys(onlinePeople).includes(p._id));
			const offlinePeople = {};
			offlinePeopleArr.forEach((p) => {
				offlinePeople[p._id] = p;
			});
			setOfflinePeople(offlinePeople);
			// console.log({offlinePeople,offlinePeopleArr});
		});
	}, [onlinePeople]);

	// deleting our user from onlinePeople
	const onlinePeopleExcludingOurUser = { ...onlinePeople };
	delete onlinePeopleExcludingOurUser[id];

	const messagesWithoutDupes = uniqBy(messages, "_id");

	return (
		<div className="flex h-screen">
			<div className="bg-white w-1/3 flex flex-col">
				<div className="flex-grow">
					<Header />
					<Peoples
						onlinePeopleExcludingOurUser={onlinePeopleExcludingOurUser}
						offlinePeople={offlinePeople}
						setSelectedUserId={setSelectedUserId}
						selectedUserId={selectedUserId}
					/>
				</div>
				<LogoutButton username={username} logout={logout} />
			</div>

			<div className="flex flex-col bg-blue-50 w-2/3 p-2">
				<ChatBox
					selectedUserId={selectedUserId}
					messagesWithoutDupes={messagesWithoutDupes}
					id={id}
					divUnderMessages={divUnderMessages}
				/>
				<MessageTypeBox
					selectedUserId={selectedUserId}
					newMessageText={newMessageText}
					setNewMessageText={setNewMessageText}
					sendMessage={sendMessage}
					sendFile={sendFile}
				/>
			</div>
		</div>
	);
}
