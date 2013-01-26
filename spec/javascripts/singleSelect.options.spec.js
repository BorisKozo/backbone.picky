describe("single select collection with options", function () {

    var Model = Backbone.Model.extend({
        initialize: function () {
            Backbone.Picky.Selectable.mixInto(this);
        }
    }),

    Collection = Backbone.Collection.extend({
        model: Model,

        initialize: function () {
            Backbone.Picky.SingleSelect.mixInto(this, { selectOnAdd: true });
        }
    });


    describe("when a selectOnAdd options is passed and an item is added", function () {
        var collection, model;

        beforeEach(function () {
            model = new Model();

            collection = new Collection();

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

});
