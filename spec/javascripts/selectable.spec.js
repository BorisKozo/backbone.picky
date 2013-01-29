describe("selectable model", function(){
  var Model = Backbone.Model.extend({
    initialize: function(){
      Backbone.Picky.Selectable.mixInto(this);
    }
  });

  describe("when selecting a model", function(){
      var model;

    beforeEach(function(){
      model = new Model();
      spyOn(model, "trigger").andCallThrough();

      model.select();
    });

    it("should be selected", function(){
      expect(model.selected).toBe(true);
    });

    it("should notify of selection", function(){
      expect(model.trigger).toHaveBeenCalledWith("model:selected");
    });
  });

  describe("when selecting a model with silent option", function () {
      var model;

      beforeEach(function () {
          model = new Model();
          spyOn(model, "trigger").andCallThrough();

          model.select({ silent: true });
      });

      it("should be selected", function () {
          expect(model.selected).toBe(true);
      });

      it("should not notify of selection", function () {
          expect(model.trigger).not.toHaveBeenCalledWith("model:selected");
      });
  });

  describe("when selecting a model that is already selected", function(){
    var model;

    beforeEach(function(){
      model = new Model();
      model.select();

      spyOn(model, "trigger").andCallThrough();
      model.select();
    });

    it("should still be selected", function(){
      expect(model.selected).toBe(true);
    });

    it("should not notify of selection", function(){
      expect(model.trigger).not.toHaveBeenCalledWith("model:selected");
    });
  });

  describe("when deselecting a model that has been selected", function(){
    var model;

    beforeEach(function(){
      model = new Model();
      model.select();

      spyOn(model, "trigger").andCallThrough();
      model.deselect();
    });

    it("should not be selected", function(){
      expect(model.selected).toBe(false);
    });

    it("should notify of deselection", function(){
      expect(model.trigger).toHaveBeenCalledWith("model:deselected");
    });
  });

  describe("when deselecting a model that has been selected with silent option", function () {
      var model;

      beforeEach(function () {
          model = new Model();
          model.select();

          spyOn(model, "trigger").andCallThrough();
          model.deselect({ silent: true });
      });

      it("should not be selected", function () {
          expect(model.selected).toBe(false);
      });

      it("should notify of deselection", function () {
          expect(model.trigger).not.toHaveBeenCalledWith("model:deselected");
      });
  });

  describe("when deselecting a model that is not selected", function(){
    var model;

    beforeEach(function(){
      model = new Model();

      spyOn(model, "trigger").andCallThrough();
      model.deselect();
    });

    it("should not be selected", function(){
      expect(model.selected).toBeFalsy();
    });

    it("should not notify of deselection", function(){
      expect(model.trigger).not.toHaveBeenCalledWith("model:deselected");
    });
  });

  describe("when toggling a model that is selected", function () {
      var model;

      beforeEach(function () {
          model = new Model();
          model.select();

          spyOn(model, "trigger").andCallThrough();
          model.toggleSelected();
      });

      it("should not be selected", function () {
          expect(model.selected).toBe(false);
      });

      it("should notify of deselection", function () {
          expect(model.trigger).toHaveBeenCalledWith("model:deselected");
      });
  });

  describe("when toggling a model that is not selected", function () {
      var model;

      beforeEach(function () {
          model = new Model();
          model.deselect();

          spyOn(model, "trigger").andCallThrough();
          model.toggleSelected();
      });

      it("should be selected", function () {
          expect(model.selected).toBe(true);
      });

      it("should notify of selection", function () {
          expect(model.trigger).toHaveBeenCalledWith("model:selected");
      });
  });

  describe("when changing selection of a deselected model to selected", function () {
      var model;

      beforeEach(function () {
          model = new Model();
          model.deselect();

          spyOn(model, "trigger").andCallThrough();
          model.changeSelected(true);
      });

      it("should be selected", function () {
          expect(model.selected).toBe(true);
      });

      it("should notify of deselection", function () {
          expect(model.trigger).toHaveBeenCalledWith("model:selected");
      });
  });

  describe("when changing selection of a selected model to selected", function () {
      var model;

      beforeEach(function () {
          model = new Model();
          model.select();

          spyOn(model, "trigger").andCallThrough();
          model.changeSelected(true);
      });

      it("should be selected", function () {
          expect(model.selected).toBe(true);
      });

      it("should not notify of selection", function () {
          expect(model.trigger).not.toHaveBeenCalledWith("model:selected");
      });
  });

  describe("when changing selection of an selected model to deselected", function () {
      var model;

      beforeEach(function () {
          model = new Model();
          model.select();

          spyOn(model, "trigger").andCallThrough();
          model.changeSelected(false);
      });

      it("should be selected", function () {
          expect(model.selected).toBe(false);
      });

      it("should notify of deselection", function () {
          expect(model.trigger).toHaveBeenCalledWith("model:deselected");
      });
  });

  describe("when changing selection of a deselected model to deselected", function () {
      var model;

      beforeEach(function () {
          model = new Model();
          model.deselect();

          spyOn(model, "trigger").andCallThrough();
          model.changeSelected(false);
      });

      it("should be deselected", function () {
          expect(model.selected).toBeFalsy();
      });

      it("should not notify of deselection", function () {
          expect(model.trigger).not.toHaveBeenCalledWith("model:deselected");
      });
  });



});
