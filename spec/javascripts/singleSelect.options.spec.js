describe("single select collection with options", function () {

    var Model = Backbone.Model.extend({
        initialize: function () {
            Backbone.Picky.Selectable.mixInto(this);
        }
    }),

    Collection = Backbone.Collection.extend({
        model: Model,

        initialize: function () {
            
        }
    });


    describe("when a selectOnAdd options is passed and an item is added", function () {
        var collection, model;

        beforeEach(function () {
            model = new Model();

            collection = new Collection();
            Backbone.Picky.SingleSelect.mixInto(collection, { selectOnAdd: true });

            spyOn(collection, "trigger").andCallThrough();

            collection.add(model);
        });

        it("should have the new model selected", function () {
            expect(collection.selected).toBe(model);
        });

        it("should have triggered the selected event", function () {
            expect(collection.trigger).toHaveBeenCalledWith("selected");
        });



    });

    describe("when a selectOnRemove `prev` options is passed and an item is deleted", function () {
        var collection, model1, model2, model3;

        beforeEach(function () {
            model1 = new Model();
            model2 = new Model();
            model3 = new Model();

            collection = new Collection([model1,model2,model3]);
            Backbone.Picky.SingleSelect.mixInto(collection, { selectOnRemove: "prev" });

            spyOn(collection, "trigger").andCallThrough();
            model2.select();
            collection.remove(model2);
            
        });

        it("should have the new model selected", function () {
            expect(collection.selected).toBe(model1);
        });

        it("should have triggered the selected event", function () {
            expect(collection.trigger).toHaveBeenCalledWith("selected");
        });

        it("should have the last model selected", function () {
            collection.remove(model1);
            expect(collection.selected).toBe(model3);
        });



    });

    describe("when a selectOnRemove `next` options is passed and an item is deleted", function () {
        var collection, model1, model2, model3;

        beforeEach(function () {
            model1 = new Model();
            model2 = new Model();
            model3 = new Model();

            collection = new Collection([model1, model2, model3]);
            Backbone.Picky.SingleSelect.mixInto(collection, { selectOnRemove: "next" });

            spyOn(collection, "trigger").andCallThrough();
            model2.select();
            collection.remove(model2);

        });

        it("should have the new model selected", function () {
            expect(collection.selected).toBe(model3);
        });

        it("should have triggered the selected event", function () {
            expect(collection.trigger).toHaveBeenCalledWith("selected");
        });

        it("should have the last model selected", function () {
            collection.remove(model3);
            expect(collection.selected).toBe(model1);
        });

    });

    describe("when a selectOnRemove custom function is passed and an item is deleted", function () {
        var collection, model1, model2, model3;

        beforeEach(function () {
            model1 = new Model();
            model2 = new Model();
            model3 = new Model();

            collection = new Collection([model1, model2, model3]);
            Backbone.Picky.SingleSelect.mixInto(collection, {
                selectOnRemove: function (model, collection, options) {
                    collection.at(collection.length - 1).select();
                }
            });

            spyOn(collection, "trigger").andCallThrough();
            model2.select();
            collection.remove(model2);
        });

        it("should have the new model selected", function () {
            expect(collection.selected).toBe(model3);
        });

        it("should have triggered the selected event", function () {
            expect(collection.trigger).toHaveBeenCalledWith("selected");
        });
    });


});
