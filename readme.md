# Backbone.Picky

Selectable entities as mixins for Backbone.Model and Backbone.Collection!
This version is based on Derick Bailey's version but adds several functionalities and 
changes from the original version.

## Source Code And Downloads

You can download the raw source code from the "src" 
folder above, or grab one of the builds from the 
"lib" folder. 

To get the latest stable release, use these links 
which point to the 'master' branch's builds:

### Standard Builds

Development: [backbone.picky.js](https://raw.github.com/BorisKozo/backbone.picky/master/lib/backbone.picky.js)

Production: [backbone.picky.min.js](https://raw.github.com/BorisKozo/backbone.picky/master/lib/backbone.picky.min.js)

### AMD/RequireJS Builds

Development: [backbone.picky.js](https://raw.github.com/BorisKozo/backbone.picky/master/lib/amd/backbone.picky.js)

Production: [backbone.picky.min.js](https://raw.github.com/BorisKozo/backbone.picky/master/lib/amd/backbone.picky.min.js)

## Documentation

This readme file contains basic usage examples and 
details on the full API, including methods, 
attributes and events.

## Method Name Overrides

#### IMPORTANT NOTE ABOUT METHOD NAME "select" by Derick Bailey

The Picky collections override the method `select` on collections. At this
point, I can't think of a better name for specifying a model has been
selected. Once I find a better name, the API will change. But for now,
you will not be able to use the standard `select` method on any
collection that has a Picky collection mixin.

## Model and Collection Interactions

If you implement a `Selectable` model, the methods on the models and the
`MultiSelect` or `SingleSelect` collection will keep each other in sync. That is, if you
call `model.select()` on a model, the collection will be notified of the
model being selected and it will correctly update, for example, the `selectedLength` and
fire the correct events.

Therefore, the following are functionally the same:

```js
model = new MyModel();
col = new MyCollection([model]);

model.select();
```

```js
model = new MyModel();
col = new MyCollection([model]);

col.select(model);
```

### Model Requirements For Picky Collections

Your model for a Picky collection must implement the following API to be
usable by the selection methods and functionality:

* `select: function(){...}`
* `deselect: function(){...}`

The easiest way to do this is to have your model mixed with `Selectable`. You
can, however, implement your own version of these methods.

## Backbone.Picky's Components:

* **Picky.Selectable:** Creates select / deselect capabilities for a model
* **Picky.MultiSelect:** Allows a collection to know about the selection of multiple models, including select all / deselect all
* **Picky.SingleSelect:** Allow a collection to have an exclusively selected model

## Picky.Selectable

Creates selectable capabilities for a model, including tracking whether or
not the model is selected, and raising events when selection changes.

### Basic Usage

Extend your model with the `Selectable` instance to make your model
selectable directly.

```js
SelectableModel = Backbone.Model.extend({
  initialize: function(){
    Backbone.Picky.Selectable.mixInto(this);
  }
});
```

### Selectable Methods

The following methods are included in the `Selectable` mixin

#### Selectable#select

Select a model, setting the model's `selected` attribute to true and 
triggering a "selected" event.

```js
var myModel = new SelectableModel();

myModel.on("model:selected", function(){
  console.log("I'm selected!");
});

myModel.select(); //=> logs "I'm selected!"
myModel.selected; //=> true
```
#### Selectable#deselect

Deselect a model, setting the model's `selected` attribute to false and 
triggering a "model:deselected" event.

```js
var myModel = new SelectableModel();

myModel.on("model:deselected", function(){
  console.log("I'm no longer selected!");
});

// must select it before it can be deselected
myModel.select();

myModel.deselect(); //=> logs "I'm no longer selected!";
myModel.selected; //=> false
```

#### Selectable#toggleSelected

Toggles the selection state between selected and deselected.

```js
var myModel = new SelectableModel();

myModel.on("model:selected", function(){
  console.log("I'm selected!");
});

myModel.on("model:deselected", function(){
  console.log("I'm no longer selected!");
});

// toggle selection
myModel.toggleSelected(); //=> "I'm selected!"
myModel.toggleSelected(); //=> "I'm no longer selected!"
```

#### Selectable#changeSelected(value)

If the given _value_ is truthy selects the model, otherwise deselects it.

```js
var myModel = new SelectableModel();

myModel.on("model:selected", function(){
  console.log("I'm selected!");
});

myModel.on("model:deselected", function(){
  console.log("I'm no longer selected!");
});

// toggle selection
myModel.changeSelected(true); //=> "I'm selected!"
myModel.changeSelected(false); //=> "I'm no longer selected!"
```

### Selectable Attributes

The following attributes are manipulated by the Selectable object

#### Selectable#selected

Returns a truthy value indicating whether or not the model is
currently selected.

### Selectable Events

The following events are triggered from Selectable models

#### "model:selected"

Triggers when a model is selected. 

#### "model:deselected"

Triggers when a model is deselected.

## Picky.SingleSelect

Creates single-select capabilities for a `Backbone.Collection`, allowing
a single model to be exclusively selected within the colllection. Selecting
another model will cause the first one to be deselected.

### Basic Usage

Mix `SingleSelect` into your collection to make your 
it support exclusive selections directly.


```js
SelectableModel = Backbone.Model.extend({
  initialize: function(){
    Backbone.Picky.Selectable.mixInto(this);
  }
});

SingleCollection = Backbone.Collection.extend({
  model: SelectableModel,

  initialize: function(){
    Backbone.Picky.SingleSelect.mixInto(this);
  }
});
```
### SingleSelect Options

You may provide an optional `options` argument to the `mixInto` function.

#### SingleSelect#options.selectOnAdd

When `selectOnAdd` is truthy then a newly added model will be automatically selected.
 ```js
SingleCollection = Backbone.Collection.extend({
  model: SelectableModel,

  initialize: function(){
    Backbone.Picky.SingleSelect.mixInto(this,{selectOnAdd:true});
  }
});

myModel = new SelectableModel();
myCol = new SingleCollection();
myCol.add(myModel); //myModel is now selected
```

#### SingleSelect#options.selectOnRemove

When `selectOnRemove` is `prev` then removing the currently selected model from the collection will select the previous model.
When `selectOnRemove` is `next` then removing the currently selected model from the collection will select the next model.
'selectOnRemove` may be a custom function (model, collection, options) that allows you which model to select.

 ```js
SingleCollection = Backbone.Collection.extend({
  model: SelectableModel,

  initialize: function(){
    Backbone.Picky.SingleSelect.mixInto(this,{selectOnRemove:"next"});
  }
});

myModel1 = new SelectableModel();
myModel2 = new SelectableModel();

myCol = new SingleCollection([myModel1, myModel2]);
myModel1.select();
myCol.remove(myModel1); //This selects myModel2
```

### SingleSelect Methods

The following methods are provided by the `SingleSelect` mixin.

#### SingleSelect#select(model)

Select a model. This method will store the selected model in
the collection's `selected` attribute, and call the model's `select`
method to ensure the model knows it has been selected.

```js
myModel = new SelectableModel();
myCol = new SingleCollection([myModel]);
myCol.select(myModel);
```

Or

```js
myModel = new SelectableModel();
myCol = new SingleCollection([myModel]);
myModel.select();
```

If the model is already selected, this is a no-op. If a previous model
is already selected, the previous model will be deselected.

#### SingleSelect#deselect(model)

Deselect the currently selected model. This method will remove the 
model from the collection's `selected` attribute, and call the model's 
`deselect` method to ensure the model knows it has been deselected.

```js
myModel = new SelectableModel();
myCol = new SingleCollection();
myCol.deselect(myModel);
```

Or

```js
myModel = new SelectableModel();
myCol = new SingleCollection();
myModel.deselect();
```

If the model is not currently selected, this is a no-op. If you try to
deselect a model that is not the currently selected model, the actual
selected model will not be deselected.

#### SingleSelect#refreshSelection

Updates the selected attribute based on the currently selected items in the SingleSelect collection.
This is useful if you add/remove/reset the items in the collection and want to update the selection state afterwards.
Calling this method will select the first selected model and deselect all the rest. It will trigger the appropriate 
`selected` and `deselected` events.

```js
myCol = new SingleCollection();

myModel = new SelectableModel();

myModel.select();

myCol.add(myModel);

myCol.refreshSelection(); //now myCol.selected === myModel
```

### SingleSelect Attributes

The following attribute is set by the multi-select automatically

### SingleSelect#selected

Returns the one selected model for this collection

```js
myCol = new SingleCollection();
myCol.select(model);

myCol.selected; //=> model
```

### SingleSelect Events

The following events are triggered by the SingleSelect based on changes
in selection:

#### "collection:selected"

Triggered when a model has been selected. Provides the selected model
as the first parameter.

#### "collection:deselected"

Triggered when a model has been deselected. Provides the deselected model
as the first parameter.

This fires whether `deselect` has been called explicitly, or the
selection is being replace through another call to `select`.

## Picky.MultiSelect

Creates multi-select capabilities for a `Backbone.Collection`, including
select all, select none and select some features.

### Basic Usage

Mix `MultiSleect` into your collection to make it 
support multiple selections directly.

```js
SelectableModel = Backbone.Model.extend({
  initialize: function(){
    Backbone.Picky.Selectable.mixInto(this);
  }
});

MultiCollection = Backbone.Collection.extend({
  
  model: SelectableModel,

  initialize: function(){
    Backbone.Picky.MultiSelect.mixInto(this);
  }
});
```

### MultiSelect Options

You may provide an optional `options` argument to the `mixInto` function.

#### MultiSelect#options.selectOnAdd

When `selectOnAdd` is truthy then a newly added model will be automatically selected.
 ```js
MultiCollection = Backbone.Collection.extend({
  model: SelectableModel,

  initialize: function(){
    Backbone.Picky.MultiSelect.mixInto(this,{selectOnAdd:true});
  }
});

myModel = new SelectableModel();
myCol = new MultiCollection();
myCol.add(myModel); //myModel is now selected
```

### MultiSelect Methods

The following methods are provided by the `MultiSelect` object

#### MultiSelect#select(model)

Select a model. This method will store the selected model in
the collection's `selected` list, and call the model's `select`
method to ensure the model knows it has been selected.

```js
myCol = new MultiCollection([myModel]);

myCol.select(myModel);
```

If the model is already selected, this is a no-op.

#### MultiSelect#deselect(model)

Deselect a model. This method will remove the  model from
the collection's `selected` list, and call the model's `deselect`
method to ensure the model knows it has been deselected.

```js
myCol = new MultiCollection([myModel]);

myCol.deselect(myModel);
```

If the model is not currently selected, this is a no-op.

#### MultiSelect#selectAll

Select all models in the collection.

```js
myCol = new MultiCollection();

myCol.selectAll();
```

Models that are already selected will not be re-selected. 
Models that are not currently selected will be selected.
The end result will be all models in the collection are
selected.

#### MultiSelect#deselectAll

Deselect all models in the collection.

```js
myCol = new MultiCollection();

myCol.deselectAll();
```

Models that are selected will be deselected. 
Models that are not selected will not be deselected again.
The end result will be no models in the collection are
selected.

#### MultiSelect#toggleSelectAll

Toggle selection of all models in the collection:

```js
myCol = new MultiCollection();

myCol.toggleSelectAll(); // select all models in the collection

myCol.toggleSelectAll(); // de-select all models in the collection
```

The following rules are used when toggling:

* If no models are selected, select them all
* If 1 or more models, but less than all models are selected, select them all
* If all models are selected, deselect them all

#### MultiSelect#refreshSelection

Updates the selected attribute based on the currently selected items in the MultiSelect collection.
This is useful if you add/remove/reset the items in the collection and want to update the selection state afterwards.
Calling this method will trigger the `collection:selected:XXX` events appropriately.

```js
myCol = new MultiCollection();

myModel = new SelectableModel();

myModel.select();

myCol.add(myModel);

myCol.refreshSelection();
```

#### MultiSelect#getSelected

Returns an array that contains all the selected models in the collection.

```js
myCol = new MultiCollection();

myModel1 = new SelectableModel();
myModel2 = new SelectableModel();

myCol.add([myModel1,myModel2]);

myMode2.select();

myCol.getSelected(); // returns [myModel2]
```

### MultiSelect Attributes

The following attribute is set by the multi-select automatically

### MultiSelect#selected

Returns a hash of selected models, keyed from the model `cid`.

```js
myCol = new MultiCollection([model]);
myCol.select(model);

myCol.selected;

//=> produces
// {
//   "c1": (model object here)
// }
```

#### MultiSelect#selectedLength

Returns the number of items in the collection that are selected.

```js
myCol = new MultiCollection([model]);
myCol.select(model);

myCol.selectedLength; //=> 1
```

### MultiSelect Events

The following events are triggered by the MultiSelect based on changes
in selection:

#### "collection:selected:all"

Triggered when all models have been selected

#### "collection:selected:none"

Triggered when all models have been deselected

#### "collection:selected:some"

Triggered when at least 1 model is selected, but less than all models have
been selected

## Building Backbone.Picky

If you wish to build Backbone.Picky on your system, you will
need Node.js for: Testacular to run the Jasmine specs, and Grunt for the build. 

### To Run The Jasmine Specs

In your console run `npm install` (needed once) then
type: `make test` 

### To Build The Packages

1. Be sure you have NodeJS and NPM installed on your system

2. Run `npm install` to install the grunt build system

3. From the project folder, run `make grunt` to produce a build

## Release Notes


## Legal Mumbo Jumbo (MIT License)
Copyright (c) 2013 Boris Kozorovitzky, 

Copyright (c) 2012 Derick Bailey, Muted Solutions, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
