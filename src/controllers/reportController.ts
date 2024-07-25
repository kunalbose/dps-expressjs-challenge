import { Request, Response } from 'express';
import { Router } from 'express';
import services from '../services/db.service';
import { v4 } from 'uuid';

const router = Router();

// get all reports
router.get('/', (req: Request, res: Response) => {
	try {
		const sql = 'Select * from reports';
		const reports = services.query(sql);
		return res.status(200).json({ reports });
	} catch (err) {
		return res.status(400).json({ err });
	}
});

// get single report
router.get('/:id', (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const sql = `select * from reports where id=${id}`;
		const reports = services.query(sql);
		if (reports.length === 1) {
			return res.status(200).json({ report: reports[0] });
		} else {
			return res
				.status(404)
				.json({ error: 'Could not find report with the id' });
		}
	} catch (err) {
		return res.status(400).json({ err });
	}
});

// get all reports of a project
router.get('/project/:id', (req: Request, res: Response) => {
	try {
		const projectId = req.params.id;
		const sql = `select * from reports projectid=${projectId}`;
		const reports = services.query(sql);
		if (reports.length === 0) {
			return res
				.status(404)
				.json({ error: 'Could not find reports for that project' });
		} else {
			return res.status(200).json({ reports });
		}
	} catch (err) {
		return res.status(400).json({ err });
	}
});

// create a report
router.post('/', (req: Request, res: Response) => {
	try {
		const report = req.body;
		if (!report.projectId) {
			return res
				.status(400)
				.json({ error: 'Cannot create report without projectID' });
		}

		// validate if the projectId is valid
		const projectSql = `Select * from projects where id=${report.projectId}`;
		const projects = services.query(projectSql);
		if (projects.length === 0) {
			return res
				.status(400)
				.json({ error: 'Invalid project id provided' });
		}

		// proceed
		const sql =
			'Insert into reports (id, text, projectid) values (@id, @text, @projectid)';
		const params = {
			id: v4(),
			text: report.text,
			projectid: report.projectId,
		};
		const result = services.run(sql, params);
		return res.status(201).json({ result });
	} catch (err) {
		return res.status(400).json({ err });
	}
});

// update a report
router.put('/:id', (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const report = req.body;

		if (!id || !report.text) {
			return res
				.status(400)
				.json({ error: 'Invalid request. Missing id or text.' });
		}

		const sql = `UPDATE reports SET text=@text WHERE id=@id`;
		const params = { text: report.text, id: id };
		const updateObj = services.run(sql, params);

		if (updateObj.changes > 0) {
			return res.status(200).json({ result: updateObj });
		} else {
			return res
				.status(404)
				.json({ error: 'No report found with the given id.' });
		}
	} catch (err) {
		console.error('Error updating report:', err);
		return res
			.status(500)
			.json({ error: 'Could not update report', details: err });
	}
});

// delete a report
router.delete('/:id', (req: Request, res: Response) => {
	try {
		const id = req.params.id;

		if (!id) {
			return res
				.status(400)
				.json({ error: 'Invalid request. Missing id.' });
		}

		const sql = `DELETE FROM reports WHERE id=@id`;
		const params = { id: id };

		const deleteObj = services.run(sql, params);

		if (deleteObj.changes > 0) {
			return res
				.status(200)
				.json({ result: 'Report deleted successfully' });
		} else {
			return res
				.status(404)
				.json({ error: 'No report found with the given id.' });
		}
	} catch (err) {
		console.error('Error deleting report:', err);
		return res
			.status(500)
			.json({ error: 'Could not delete report', details: err });
	}
});

export { router };
