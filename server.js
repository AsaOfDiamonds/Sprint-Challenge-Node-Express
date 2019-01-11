const express = require('express');
const configureMiddleware = require('./config/middleware');
const dbProject = require('./data/helpers/projectModel');
const dbActions = require('./data/helpers/actionModel');



const server = express();

//middleware
configureMiddleware(server);

//  Project routes
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
    if (req.body.name === undefined || req.body.description === undefined ) {
        res.status(400).json({ message: "name and notes for the action are required." });
        return;
    }

    dbProject.insert(req.body)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ message: "Failed to save Project", error: err });
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

// Project end points
server.get('/api/project', getAllProjects);
server.get('/api/project/:id', getProject);
server.post('/api/project', addProject);
server.delete('/api/project/:id', deleteProject);
server.put('/api/project/:id',  updateProject);
server.get('/api/project/:id/actions', getActionsOfProject);



// Actions routes

const getAllActions = (req, res) => {
    dbActions.get()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to get Actions.', error: err });
        });
}

const getActionById = (req, res) => {
    dbActions.get(req.params.id)
        .then(post => {
            console.log(post)
            if (post.length !== 0) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: `Failed to get Action with specific ID: ${req.params.id} does not exist` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: `The Action with id: ${req.params.id} could not be retrieved.`, error: err });
        });
}

const deleteAction = async (req, res) => {
    const { id } = req.params;
    try {
        const recordsDeleted = await dbActions.remove(id);
        if (recordsDeleted > 0) {
            res.status(200).json(recordsDeleted);
        } else {
            res.status(404).json({ message: `Failed to delete Action, Action does not exist` });
        }
    } catch (err) {
        res.status(500).json({ message: "The Action could not be removed", err });
    }
}

const addNewAction = (req, res) => {
    if (req.body.project_id === undefined || req.body.description === undefined || req.body.notes === undefined) {
        res.status(400).json({ message: "description and notes for the action are required." });
        return;
    }

    dbActions.insert(req.body)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ message: "Failed to save Action", error: err });
        });
}

const updateAction = (req, res) => {
    if (req.body.project_id === undefined || req.body.description === undefined || req.body.notes === undefined) {
        res.status(400).json({ message: "Name and description for this Action are required." });
        return;
    }

    dbActions.update(req.params.id, req.body)
        .then(count => {
            if (count > 0) {
                dbActions.get(req.params.id)
                    .then(action => {
                        if ((action.hasOwnProperty('length') && action.length > 0)) {
                            res.status(200).json(action);
                        } else {
                            res.status(404).json({ message: `Failed to find Action with the specified ID ${req.params.id}.` })
                        }
                    });
            } else {
                res.status(404).json({
                    message: `The Project with the specified ID ${req.params.project_id} does not exist.`
                })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to update Action', error: err });
        });
}

// //Post end points
server.get('/api/actions', getAllActions); 
server.get('/api/actions/:id', getActionById);
server.post('/api/actions', addNewAction);
server.delete('/api/actions/:id', deleteAction);
server.put('/api/actions/:id', updateAction);



module.exports = server