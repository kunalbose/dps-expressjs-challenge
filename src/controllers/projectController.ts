import { Request, Response } from 'express';
import { Router } from 'express';
import services from '../services/db.service';
import { v4 } from 'uuid';

const router = Router();

// get all projects
router.get('/', (req: Request, res: Response) => {
	try {
		const sql = 'Select * From projects';
		const allProjects = services.query(sql);
		return res.status(200).json({ projects: allProjects });
	} catch (err) {
		return res.status(400).json({ error: 'Could not get all projects' });
	}
});

// get project by id
router.get('/:id', (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const sql = `Select * from projects where id = ${id}`;
		const project = services.query(sql);
		if (project.length === 1) {
			return res.status(200).json({ project: project[0] });
		} else {
			return res.status(404).json({ error: 'Could not find project' });
		}
	} catch (err) {
		return res.status(400).json({ error: 'Could not get project' });
	}
});

// create project
router.post('/', (req: Request, res: Response) => {
	try {
		const data = req.body;
		if (data.name) {
			const sql = `Insert into projects (id, name, description) values (@id, @name, @description)`;
			const params = {
				id: v4(),
				name: data.name,
				description: data.description || '',
			};
			console.log(params, 'paramss');
			const project = services.run(sql, params);
			return res.status(201).json({ project });
		} else {
			return res
				.status(400)
				.json({ error: 'Name is compulsory to create the project' });
		}
	} catch (err) {
		return res.status(400).json({ error: 'Could not create project' });
	}
});

router.put('/:id', (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const body = req.body;
		const sql = `Update projects Set name=@name, description=@description where id=@id`;
		const params = { id, name: body.name, description: body.description };
		const updateParam = services.run(sql, params);
		return res.status(200).json({ updateParam });
	} catch (err) {
		return res.status(400).json({ error: 'Could not update project' });
	}
});

router.delete('/:id', (req: Request, res: Response) => {
	try {
		const projectId = req.params.id;

		// delete all reports for this project
		const sql = `Delete from reports where projectid=@projectid`;
		const params = { projectid: projectId };
		services.run(sql, params);

		// delete the project
		const sql2 = `Delete from projects where id=@id`;
		const params2 = { id: projectId };
		services.run(sql2, params2);

		return res.status(200).json({ message: 'Project deleted' });
	} catch (err) {
		return res.status(400).json({ error: 'Could not delete project' });
	}
});

export { router };
