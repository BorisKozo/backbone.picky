describe("multi-select collection toggle", function(){
  var Model = Backbone.Model.extend({
    initialize: function(){
      Backbone.Picky.Selectable.mixInto(this);
    }
  });
  
  var Collection = Backbone.Collection.extend({
    model: Model,

    initialize: function(){
        Backbone.Picky.MultiSelect.mixInto(this);
    }
  });

  describe("when no models are selected, and toggling", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      spyOn(collection, "trigger").andCallThrough();

      collection.toggleSelectAll();
    });
    
    it("should trigger 'all' selected event", function(){
        expect(collection.trigger).toHaveBeenCalledWith("collection:selected:all", collection);
    });

    it("should have a selected count of 2", function(){
      expect(collection.selectedLength).toBe(2);
    });

    it("should have 2 models in the selected list", function(){
      var size = _.size(collection.selected);
      expect(size).toBe(2);
    });
  });
  
  describe("when some models are selected, and toggling", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();

      spyOn(collection, "trigger").andCallThrough();

      collection.toggleSelectAll();
    });
    
    it("should trigger 'all' selected event", function(){
        expect(collection.trigger).toHaveBeenCalledWith("collection:selected:all", collection);
    });

    it("should have a selected count of 2", function(){
      expect(collection.selectedLength).toBe(2);
    });

    it("should have 2 models in the selected list", function(){
      var size = _.size(collection.selected);
      expect(size).toBe(2);
    });
  });
  
  describe("when all models are selected, and toggling", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();
      m2.select();

      spyOn(collection, "trigger").andCallThrough();

      collection.toggleSelectAll();
    });
    
    it("should trigger 'none' selected event", function(){
        expect(collection.trigger).toHaveBeenCalledWith("collection:selected:none", collection);
    });

    it("should have a selected count of 0", function(){
      expect(collection.selectedLength).toBe(0);
    });

    it("should have 0 models in the selected list", function(){
      var size = _.size(collection.selected);
      expect(size).toBe(0);
    });
  });

});
