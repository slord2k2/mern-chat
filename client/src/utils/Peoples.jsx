import Contact from "../Contact";
// eslint-disable-next-line react/prop-types
export default function Peoples({ onlinePeopleExcludingOurUser, offlinePeople, setSelectedUserId, selectedUserId}) {
	return (
		<div>
			{Object.keys(onlinePeopleExcludingOurUser).map((userId) => (
				// eslint-disable-next-line react/jsx-key
				<Contact
					key={userId}
					id={userId}
					online={true}
					username={onlinePeopleExcludingOurUser[userId]}
					onClick={() => setSelectedUserId(userId)}
					selected={selectedUserId === userId}
				/>
			))}
			{Object.keys(offlinePeople).map((userId) => (
				// eslint-disable-next-line react/jsx-key
				<Contact
					key={userId}
					id={userId}
					online={false}
					// eslint-disable-next-line react/prop-types
					username={offlinePeople[userId].username}
					onClick={() => setSelectedUserId(userId)}
					selected={selectedUserId === userId}
				/>
			))}
		</div>
	);
}
