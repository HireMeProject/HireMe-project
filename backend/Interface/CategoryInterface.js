class ICategory{
    async createCategory(name) {
        // You can add extra logic here if needed
        throw new Error("Method  must be implemented");
      }
    
      async getAllCategories() {
        throw new Error("Method  must be implemented");
      }
    
      async getCategoryById(categoryId) {
        throw new Error("Method  must be implemented");
      }
    
      async updateCategory(categoryId, newName) {
        throw new Error("Method  must be implemented");
      }
    
      async deleteCategory(categoryId) {
        throw new Error("Method  must be implemented");
      }
    
      
}
module.exports=ICategory;