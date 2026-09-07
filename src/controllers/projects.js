// Import any needed model functions
import { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails } from '../models/projects.js';

// Number of upcoming projects to display on the projects page
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res, next) => {
    const projectId = Number(req.params.id);

    // The id in the URL is not a positive whole number, so no project can match it
    if (!Number.isInteger(projectId) || projectId < 1) {
        const err = new Error('Service Project Not Found');
        err.status = 404;
        return next(err);
    }

    const projectDetails = await getProjectDetails(projectId);

    // No project exists with this id, so hand off to the 404 handler
    if (!projectDetails) {
        const err = new Error('Service Project Not Found');
        err.status = 404;
        return next(err);
    }

    const title = 'Project Details';

    res.render('project', { title, projectDetails });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };