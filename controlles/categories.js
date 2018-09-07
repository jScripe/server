module.exports = class Categories {
    contructor() {

    }

    getCategoryById(id, catalog) {
        const result = catalog.categories.filter((item) => {
            return item.id === +id;
        });
        return result;
    }

    returnTheCatalog(req, res, catalog) {
        res.send(catalog);
    }

    returnTheCatalogById(req, res, catalog) {
        this.id = req.params.categoryId;
        this.category = this.getCategoryById(this.id, catalog);
        res.send(this.category);
    }
}