describe("multi-select collection deselecting", function(){
  var Model = Backbone.Model.extend({
    initialize: function(){
      Backbone.Picky.Selectable.mixInto(this);
    }
  });
  
  var Collection = Backbone.Collection.extend({
    model: Model,

    initialize: function(options){
        Backbone.Picky.MultiSelect.mixInto(this);
    }
  });
  
  describe("when no models are selected, and deselecting all", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();
      collection = new Collection([m1, m2]);
      m1.select();
      m2.select();
      spyOn(collection, "trigger").andCallThrough();

      collection.deselectAll();
    });
    
    it("should trigger 'none' selected event", function(){
      expect(collection.trigger).toHaveBeenCalledWith("selected:none", collection);
    });

    it("should have a selected count of 0", function(){
      expect(collection.selectedLength).toBe(0);
    });

    it("should not have any models in the selected list", function(){
      var size = _.size(collection.selected);
      expect(size).toBe(0);
    });
  });

  describe("when 1 model is selected, and deselecting all", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();

      spyOn(collection, "trigger").andCallThrough();
      collection.deselectAll();
    });
    
    it("should trigger 'none' selected event", function(){
      expect(collection.trigger).toHaveBeenCalledWith("selected:none", collection);
    });

    it("should have a selected count of 0", function(){
      expect(collection.selectedLength).toBe(0);
    });

    it("should not have any models in the selected list", function(){
      var size = _.size(collection.selected);
      expect(size).toBe(0);
    });
  });

  describe("when all models are selected, and deselecting all", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();
      m2.select();

      spyOn(collection, "trigger").andCallThrough();
      collection.deselectAll();
    });
    
    it("should trigger 'none' selected event", function(){
      expect(collection.trigger).toHaveBeenCalledWith("selected:none", collection);
    });

    it("should have a selected count of 0", function(){
      expect(collection.selectedLength).toBe(0);
    });

    it("should not have any models in the selected list", function(){
      var size = _.size(collection.selected);
      expect(size).toBe(0);
    });
  });

});
