import userResource from "./userResource.js";

function userCollection(users) {
	return users.map((user) => {
		return userResource(user);
	});
}

export default userCollection;
