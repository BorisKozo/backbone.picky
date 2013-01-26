describe("multi-select collection with options", function () {
    var Model = Backbone.Model.extend({
        initialize: function () {
            Backbone.Picky.Selectable.mixInto(this);
        }
    });

    var Collection = Backbone.Collection.extend({
        model: Model,

        initialize: function (options) {
            Backbone.Picky.MultiSelect.mixInto(this, { selectOnAdd: true });
        }
    });

    describe("adding a model and select on add is on", function () {
        var m1, collection;

        beforeEach(function () {
            m1 = new Model();
            collection = new Collection();
            spyOn(collection, "trigger").andCallThrough();

            collection.add(m1);
        });

        it("should trigger 'all' selected event", function () {
            expect(collection.trigger).toHaveBeenCalledWith("selected:all", collection);
        });

        it("should selected the added model", function () {
            expect(m1.selected).toBeTruthy();
        });

        it("should contain the selected model in selected list", function () {
            expect(collection.selected[m1.cid]).toBe(m1);
        });

    });
});
