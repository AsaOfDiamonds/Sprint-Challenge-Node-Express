const express = require('express');
const configureMiddleware = require('./config/middleware');
const dbProject = require('./data/helpers/projectModel');


const server = express();

//middleware
configureMiddleware(server);

// routes
server.get('/', (req, res) => {
    res.send('God saw all that He had made, and found it very good')
});

const getAllProjects = (req, res) => {
    dbProject.get()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ message: ` Failed to get Project`, error: err });
        });
}

const getProject = (req, res) => {
    dbProject.get(req.params.id)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ message: `Failed to get Project`, error: err });
        });
}

const addProject = (req, res) => {
    const { name } = req.body;
    dbProject.insert({ name })
        .then(id => {
            res.status(201).json(id);
        })
        .catch(err => {
            res.status(500).json({ message: `Failed to add Project`, error: err });
        });
}

const deleteProject = (req, res) => {
    dbProject.remove(req.params.id)
        .then(projectDeleted => {
            if (projectDeleted > 0) {
                res.status(200).json(projectDeleted);
            } else {
                res.status(404).json({ message: `The Project with the specified ID does not exist`, projectDeleted });
            }
        })
        .catch(err => {
            res.status(500).json({ message: `Failed to delete Project`, error: err });
        });

}

const updateProject = (req, res) => {
    if (req.body.name === undefined) {
        res.status(400).json({ errorMessage: "Please provide a name for the Project." });
        return;
    }
    dbProject.update(req.params.id, req.body)
        .then(projectUpdated => {
            if (projectUpdated > 0) {
                res.status(200).json({ message: `${projectUpdated} Project updated` });
            } else {
                res.status(404).json({ message: 'Failed to update Project with the specific ID' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: `Internal server error. Could not update Project`, error: err });
        });

}

const getActionsOfProject = (req, res) => {
    const { id } = req.params;
    dbProject.getProjectActions(id)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({ message: `Could not find Actions of the Project with ${id}`, error: err });
        });
}

//User end points
server.get('/api/project', getAllProjects);
server.get('/api/project/:id', getProject);
server.post('/api/project', addProject);
server.delete('/api/project/:id', deleteProject);
server.put('/api/project/:id',  updateProject);
server.get('/api/project/:id/actions', getActionsOfProject);


module.exports = server