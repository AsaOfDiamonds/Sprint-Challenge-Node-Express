import React, { Component } from 'react';

import Project from './Project';

class Projects extends Component {
    render() {
        return (
            <div className="projects">
                <h1>Projects</h1>
                <ul>
                    {this.props.projects.map(project => {
                        return (
                            <Project
                                name={project.name}
                                description={project.description}
                                completed={project.completed}
                                key={project.id}
                            />
                        );
                    })}
                </ul>
            </div>
        );
    }
}

Project.defaultProps = {
    projects: [],
};

export default Projects;