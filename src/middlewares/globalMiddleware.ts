import { Request, Response, NextFunction } from 'express';

function globalMiddleware(req: Request, res: Response, next: NextFunction) {
	try {
		const token = req.headers['token'];
		if (token === 'Password123') {
			return next();
		} else {
			return res.status(401).json({ error: 'user not authenticated' });
		}
	} catch (err) {
		return res.status(400).json({ error: err });
	}
}

export { globalMiddleware };
