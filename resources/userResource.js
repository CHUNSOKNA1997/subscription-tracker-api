function userResource(user) {
	return {
		id: user.id,
		uuid: user.uuid,
		email: user.email,
		name: user.name,
	};
}

export default userResource;
