const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Message = require("./models/Message");
const User = require("./models/User");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const ws = require("ws");
const cors = require("cors");

dotenv.config();
mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

async function getUserDataFromRequest(req) {
	return new Promise((resolve, reject) => {
		const token = req.cookies?.token;
	if (token) {
		jwt.verify(token, jwtSecret, {}, (err, userData) => {
			if (err) throw err;
			resolve(userData);
		});
	}
	else {
		reject("no token");
	}
	})
	
}

app.get("/test", (req, res) => {
	res.json({ message: "Hello World!" });
});

app.get("/messages/:userId", async (req, res) => {
	const { userId } = req.params;
	const userData=await getUserDataFromRequest(req);
	const ourUserId=userData.userId;
	const messages = await Message.find({
		sender:{$in:[userId,ourUserId]},
		recipient:{$in:[userId,ourUserId]}
	}).sort({ createdAt: 1 });
	res.json(messages);
});

app.get('/people',async (req,res)=>{
	const users= await User.find({},{'_id':1,username:1});
	res.json(users);
})

app.get("/profile", (req, res) => {
	const token = req.cookies?.token;
	if (token) {
		jwt.verify(token, jwtSecret, {}, (err, userData) => {
			if (err) throw err;
			res.json(userData);
		});
	} else {
		res.status(401).json("no token");
	}
});
app.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const foundUser = await User.findOne({ username });
	if (foundUser) {
		const passOk = bcrypt.compareSync(password, foundUser.password);
		if (passOk) {
			jwt.sign(
				{ userId: foundUser._id, username },
				jwtSecret,
				{},
				(err, token) => {
					res.cookie("token", token, { sameSite: "none", secure: true }).json({
						id: foundUser._id,
					});
				}
			);
		}
	}
	// if (!foundUser) {
	// 	res.status(401).json({ message: "User not found!" });
	// }
});
app.post("/register", async (req, res) => {
	const { username, password } = req.body;
	try {
		const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
		const createdUser = await User.create({
			username: username,
			password: hashedPassword,
		});
		jwt.sign(
			{ userId: createdUser._id, username },
			jwtSecret,
			{},
			(err, token) => {
				if (err) throw err;
				res
					.cookie("token", token, { sameSite: "none", secure: true })
					.status(201)
					.json({
						id: createdUser._id,
						message: "User created successfully!",
					});
			}
		);
	} catch (err) {
		if (err) throw err;
		res.status(500).json({ message: "Something went wrong!" });
	}
});

const server = app.listen(3000, () => {
	console.log("Server listening on port 3000!");
});

// read username and id form the cookie for this connection
const wss = new ws.WebSocketServer({ server });
wss.on("connection", (connection, req) => {
	function notifyAboutOnlinePeople(){
		[...wss.clients].forEach((client) => {
			client.send(
				JSON.stringify({
					online: [...wss.clients].map((c) => ({
						userId: c.userId,
						username: c.username,
					})),
				})
			);
		});
	}
	connection.isAlive = true;
	connection.timer=setInterval(() => {
			connection.ping();
			connection.deathTimer=setTimeout(() => {
				connection.isAlive=false;
				connection.terminate();
				notifyAboutOnlinePeople();
			},1000)
	},3000)
	connection.on('pong',()=>{
		clearTimeout(connection.deathTimer);
	})

	const cookie = req.headers.cookie;
	if (cookie) {
		const tokenCookieString = cookie
			.split(";")
			.find((str) => str.startsWith("token="));
		if (tokenCookieString) {
			const token = tokenCookieString.split("=")[1];
			if (token) {
				jwt.verify(token, jwtSecret, {}, (err, userData) => {
					if (err) throw err;
					const { userId, username } = userData;
					connection.userId = userId;
					connection.username = username;
				});
			}
		}
	}

	connection.on("message", async (message) => {
		const messageData = JSON.parse(message.toString());
		const { recipient, text } = messageData;
		if (recipient && text) {
			const messageDoc = await Message.create({
				sender: connection.userId,
				recipient,
				text,
			});
			[...wss.clients]
				.filter((c) => c.userId === recipient)
				.forEach((c) =>
					c.send(
						JSON.stringify({
							text,
							recipient,
							sender: connection.userId,
							_id: messageDoc._id,
						})
					)
				);
		}
	});

	// notify everyone about online people (when someone connected)
	notifyAboutOnlinePeople();
});

