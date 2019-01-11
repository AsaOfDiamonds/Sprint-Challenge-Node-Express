import React from 'react';

const Project = props => {
    return (
        <div className="project">
            <h2>{props.name}</h2>
            <p>{props.description}</p>
            <p>{props.completed} </p>
        </div>
    );
};

Project.defaultProps = {
    name: '',
    description: '',
    completed: ''
};

export default Project;
