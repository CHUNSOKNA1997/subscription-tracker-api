const responseMiddleware = (req, res, next) => {
	res.success = (data) => {
		res.status(200).json({
			success: true,
			data,
		});
	};

	res.error = (error) => {
		res.status(500).json({
			success: false,
			error,
		});
	};

	next();
};

export { responseMiddleware };
