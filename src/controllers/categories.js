// Import any needed model functions
import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Define validation rules for the category form.
// Note: these are intentionally stricter than the client-side rules in the views.
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

// Postgres error code raised when a UNIQUE constraint is violated.
// category.name is UNIQUE, so this means the name is already taken.
const PG_UNIQUE_VIOLATION = '23505';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
    const categoryId = Number(req.params.id);

    // The id in the URL is not a positive whole number, so no category can match it
    if (!Number.isInteger(categoryId) || categoryId < 1) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    const categoryDetails = await getCategoryDetails(categoryId);

    // No category exists with this id, so hand off to the 404 handler
    if (!categoryDetails) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    const projects = await getProjectsByCategoryId(categoryId);
    const title = 'Category Details';

    res.render('category', { title, categoryDetails, projects });
};

const showAssignCategoriesForm = async (req, res, next) => {
    const projectId = Number(req.params.projectId);

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

    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body?.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};



const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';

    res.render('new-category', { title });
};

const processNewCategoryForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new category form
        return res.redirect('/new-category');
    }

    // Extract form data from req.body
    const { name } = req.body;

    try {
        // Create the new category in the database
        const newCategoryId = await createCategory(name);

        req.flash('success', 'New category created successfully!');
        res.redirect(`/category/${newCategoryId}`);
    } catch (error) {
        console.error('Error creating new category:', error);

        if (error.code === PG_UNIQUE_VIOLATION) {
            req.flash('error', `A category named "${name}" already exists.`);
        } else {
            req.flash('error', 'There was an error creating the category.');
        }

        res.redirect('/new-category');
    }
};

const showEditCategoryForm = async (req, res, next) => {
    const categoryId = Number(req.params.id);

    // The id in the URL is not a positive whole number, so no category can match it
    if (!Number.isInteger(categoryId) || categoryId < 1) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    const categoryDetails = await getCategoryDetails(categoryId);

    // No category exists with this id, so hand off to the 404 handler
    if (!categoryDetails) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    const title = 'Edit Category';

    res.render('edit-category', { title, categoryDetails });
};

const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit category form
        return res.redirect(`/edit-category/${categoryId}`);
    }

    // Extract form data from req.body
    const { name } = req.body;

    try {
        // Update the category in the database
        await updateCategory(categoryId, name);

        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error updating category:', error);

        if (error.code === PG_UNIQUE_VIOLATION) {
            req.flash('error', `A category named "${name}" already exists.`);
        } else {
            req.flash('error', 'There was an error updating the category.');
        }

        res.redirect(`/edit-category/${categoryId}`);
    }
};

// Export any controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};