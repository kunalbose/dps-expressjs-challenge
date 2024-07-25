import { Request, Response } from 'express';
import { Router } from 'express';
import services from '../services/db.service';

const router = Router();
type report = {
	id: string;
	text: string;
	projectid: string;
};

router.get('/', (req: Request, res: Response) => {
	try {
		const sql = 'Select * from reports';
		const reports: report[] = services.query(sql) as report[];
		if (reports.length === 0) {
			return res.status(200).json({ reports });
		}

		const results: report[] = [];

		reports.forEach((report) => {
			const wordCount: { [key: string]: number } = {};
			report.text.split(' ').every((word) => {
				const currentWord = word.toLocaleLowerCase();
				if (wordCount[currentWord]) {
					if (wordCount[currentWord] === 2) {
						results.push(report);
						return false;
					} else {
						wordCount[currentWord] = wordCount[currentWord] + 1;
						return true;
					}
				} else {
					wordCount[currentWord] = 1;
					return true;
				}
			});
		});

		return res.status(200).json({ results });
	} catch (err) {
		return res.status(400).json({ err });
	}
});

export { router };
