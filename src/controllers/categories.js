// Import any needed model functions
import { getAllCategories, getCategoryDetails, getProjectsByCategoryId } from '../models/categories.js';

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

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };