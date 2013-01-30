describe("single select collection", function () {

    var Model = Backbone.Model.extend({
        initialize: function () {
            Backbone.Picky.Selectable.mixInto(this);
        }
    });

    var Collection = Backbone.Collection.extend({
        model: Model,

        initialize: function () {
            Backbone.Picky.SingleSelect.mixInto(this);
        }
    });

    describe("when selecting a model via the model's select", function () {
        var model, collection;

        beforeEach(function () {
            model = new Model();
            collection = new Collection([model]);

            spyOn(collection, "trigger").andCallThrough();

            model.select();
        });

        it("should hang on to the currently selected model", function () {
            expect(collection.selected).toBe(model);
        });

        it("should trigger a selected event", function () {
            expect(collection.trigger).toHaveBeenCalledWith("collection:selected", model);
        });
    });

    describe("when selecting a model via the collection's select", function () {
        var model, collection;

        beforeEach(function () {
            model = new Model();
            collection = new Collection([model]);

            spyOn(collection, "trigger").andCallThrough();
            spyOn(model, "select").andCallThrough();

            collection.select(model);
        });

        it("should hang on to the currently selected model", function () {
            expect(collection.selected).toBe(model);
        });

        it("should trigger a selected event", function () {
            expect(collection.trigger).toHaveBeenCalledWith("collection:selected", model);
        });

        it("should tell the model to select itself", function () {
            expect(model.select).toHaveBeenCalled();
        });
    });

    describe("when selecting a model that is already selected", function () {
        var model, collection;

        beforeEach(function () {
            model = new Model();
            collection = new Collection([model]);

            model.select();

            spyOn(collection, "trigger").andCallThrough();

            collection.select(model);
        });

        it("should not trigger a selected event", function () {
            expect(collection.trigger).not.toHaveBeenCalledWith("selected", model);
        });
    });

    describe("when a model is already selected and selecting a different model", function () {
        var m1, m2, collection;

        beforeEach(function () {
            m1 = new Model();
            m2 = new Model();
            collection = new Collection([m1, m2]);
            m1.select();

            spyOn(collection, "trigger").andCallThrough();
            spyOn(m1, "deselect").andCallThrough();
            
            m2.select();
        });

        it("should hang on to the currently selected model", function () {
            expect(collection.selected).toBe(m2);
        });

        it("should trigger a selected event", function () {
            expect(collection.trigger).toHaveBeenCalledWith("collection:selected", m2);
        });

        it("should deselect the first model", function () {
            expect(m1.deselect).toHaveBeenCalled();
        });

        it("should fire a deselect event for the first model", function () {
            expect(collection.trigger).toHaveBeenCalledWith("collection:deselected", m1);
        });
    });

    describe("when no model is selected and deselecting", function () {
        var collection;

        beforeEach(function () {
            collection = new Collection();

            spyOn(collection, "trigger").andCallThrough();

            collection.deselect();
        });

        it("should not trigger a selected or deselected event", function () {
            expect(collection.trigger).not.toHaveBeenCalled();
        });
    });

    describe("when a model is selected and deselecting the model", function () {
        var model, collection;

        beforeEach(function () {
            model = new Model();
            collection = new Collection([model]);
            model.select();

            spyOn(collection, "trigger").andCallThrough();
         
            collection.deselect();
        });

        it("should not hang on to the currently selected model", function () {
            expect(collection.selected).toBeUndefined();
        });

        it("should trigger a deselected event", function () {
            expect(collection.trigger).toHaveBeenCalledWith("collection:deselected", model);
        });
    });

    describe("when one model is selected and deselecting another model through the collection's deselect", function () {
        var m1, m2, collection;

        beforeEach(function () {
            m1 = new Model();
            m2 = new Model();
            collection = new Collection([m1, m2]);
            collection.select(m1);

            spyOn(m1, "deselect").andCallThrough();
            spyOn(collection, "trigger").andCallThrough();

            collection.deselect(m2);
        });

        it("should still hang on to the currently selected model", function () {
            expect(collection.selected).toBe(m1);
        });

        it("should keep the selected model selected", function () {
            expect(m1.selected).toBe(true);
        });

        it("should not deselect the selected model", function () {
            expect(m1.deselect).not.toHaveBeenCalled();
        });

        it("should not trigger a deselected event for the selected model", function () {
            expect(collection.trigger).not.toHaveBeenCalledWith("model:deselected", m1);
        });

        it("should not trigger a deselected event for the non-selected model", function () {
            expect(collection.trigger).not.toHaveBeenCalledWith("model:deselected", m2);
        });
    });

    describe("when one model is selected and deselecting another model through the model's deselect", function () {
        var m1, m2, collection;

        beforeEach(function () {
            m1 = new Model();
            m2 = new Model();
            collection = new Collection([m1, m2]);
            collection.select(m1);

            spyOn(m1, "deselect").andCallThrough();
            spyOn(collection, "trigger").andCallThrough();

            m2.deselect();
        });

        it("should still hang on to the currently selected model", function () {
            expect(collection.selected).toBe(m1);
        });

        it("should keep the selected model selected", function () {
            expect(m1.selected).toBe(true);
        });

        it("should not deselect the selected model", function () {
            expect(m1.deselect).not.toHaveBeenCalled();
        });

        it("should not trigger a deselected event for the selected model", function () {
            expect(collection.trigger).not.toHaveBeenCalledWith("model:deselected", m1);
        });

        it("should not trigger a deselected event for the non-selected model", function () {
            expect(collection.trigger).not.toHaveBeenCalledWith("model:deselected", m2);
        });
    });

    describe("when a model is selected but it is not in the collection", function () {
        var collection;

        beforeEach(function () {
            var model = new Model();
            collection = new Collection();



            spyOn(collection, "trigger").andCallThrough();

            collection.select(model);
        });

        it("should not have a selected model", function () {
            expect(collection.selected).toBeUndefined();
        });

        it("should not trigger a selected or deselected event", function () {
            expect(collection.trigger).not.toHaveBeenCalled();
        });
    });

    describe("when a collection is refreshed and there was a selected item", function () {
        var collection, model1, model2, model3;

        beforeEach(function () {
            model1 = new Model();
            model2 = new Model();
            model3 = new Model();
            model1.select();
            model2.select();
            model3.deselect();
            collection = new Collection([model1, model2, model3]);


            spyOn(collection, "trigger").andCallThrough();

            collection.refreshSelection();
        });

        it("should have model 1 selected", function () {
            expect(collection.selected).toEqual(model1);
            expect(model1.selected).toBeTruthy();
        });

        it("should have model 2 deselected", function () {
            expect(collection.selected).not.toEqual(model2);
            expect(model2.selected).toBeFalsy();
        });

        it("should have model 3 deselected", function () {
            expect(collection.selected).not.toEqual(model3);
            expect(model3.selected).toBeFalsy();
        });

        it("should trigger a selected event", function () {
            expect(collection.trigger).toHaveBeenCalled();
        });
    });

    describe("when a collection is refreshed and there was no selected items", function () {
        var collection, model1, model2, model3;

        beforeEach(function () {
            model1 = new Model();
            model2 = new Model();
            model3 = new Model();
            collection = new Collection([model1, model2, model3]);


            spyOn(collection, "trigger").andCallThrough();

            collection.refreshSelection();
        });

        it("should have no model selected", function () {
            expect(collection.selected).toBeFalsy();
        });

        it("should have models deselected", function () {
            expect(model2.selected).toBeFalsy();
            expect(model2.selected).toBeFalsy();
        });

    });

    describe("when removing a selected item no item is selected", function () {
        var collection, model1, model2, model3;

        beforeEach(function () {
            model1 = new Model();
            model2 = new Model();
            model3 = new Model();
            collection = new Collection([model1, model2, model3]);

            model2.select();

            spyOn(collection, "trigger").andCallThrough();

            collection.remove(model2);
        });

        it("should have no model selected", function () {
            expect(collection.selected).toBeFalsy();
        });

    });
    describe("when reseting the collection some model should be selected", function () {
        var collection, model1, model2, model3;

        beforeEach(function () {
            model1 = new Model();
            model2 = new Model();
            model3 = new Model();
            model2.select();
            collection = new Collection([model1, model2, model3]);

        

            collection.trigger("reset", collection);
        });

        it("should have model2 selected", function () {
            expect(collection.selected).toBe(model2);
        });


    });

});
