const CategoryManager = require("../Services/CategoryManager");

    // Créer une nouvelle catégorie
    const  createCategory=async(req, res)=> {
        try {
            const { name } = req.body;
            const category = await CategoryManager.createCategory(name);
            return res.status(201).json({ message: "Catégorie créée avec succès.", category });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Récupérer toutes les catégories
    const  getAllCategories=async(req, res)=> {
        try {
            const categories = await CategoryManager.getAllCategories();
            return res.status(200).json(categories);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Récupérer une catégorie par ID
    const  getCategoryById=async(req, res)=> {
        try {
            const { id } = req.params;
            const category = await CategoryManager.getCategoryById(id);
            return res.status(200).json(category);
        } catch (error) {
            return res.status(404).json({ error: error.message });
        }
    }

    // Mettre à jour une catégorie
    const  updateCategory=async(req, res)=> {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const updatedCategory = await CategoryManager.updateCategory(id, name);
            return res.status(200).json({ message: "Catégorie mise à jour avec succès.", updatedCategory });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Supprimer une catégorie
    const  deleteCategory=async(req, res)=> {
        try {
            const { id } = req.params;
            await CategoryManager.deleteCategory(id);
            return res.status(200).json({ message: "Catégorie supprimée avec succès." });
        } catch (error) {
            return res.status(404).json({ error: error.message });
        }
    }

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
