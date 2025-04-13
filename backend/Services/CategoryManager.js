const { Category } = require("../models/Category");

class CategoryManager {
    // Créer une nouvelle catégorie
     async createCategory(name) {
        if (!name) {
            throw {status:400,message:"Le nom de la catégorie est requis."}
        }
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            throw {status:400,message:"Cette catégorie existe déjà."}
        }
        const category = new Category({ name });
        await category.save();
        return category;
    }

    // Récupérer toutes les catégories
     async getAllCategories() {
        return await Category.find().sort({ createdAt: -1 });
    }

    // Récupérer une catégorie par son ID
     async getCategoryById(categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) {
            throw {status:404,message:"Catégorie non trouvée."}
        }
        return category;
    }

    // Mettre à jour une catégorie
     async updateCategory(categoryId, newName) {
        if (!newName) {
            throw {status:404,message:"Le nouveau nom est requis."}
        }
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name: newName },
            { new: true, runValidators: true }
        );
        if (!updatedCategory) {
            throw {status:404,message:"Catégorie non trouvée."}
        }
        return updatedCategory;
    }

    // Supprimer une catégorie
     async deleteCategory(categoryId) {
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            throw {status:404,message:"Catégorie non trouvée."}
        }
        return deletedCategory;
    }
}

module.exports = new CategoryManager();
