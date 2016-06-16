/* globals QUnit  */

sap.ui.require(
  [
    'gizur/trailerapp/util/Util',
    'gizur/trailerapp/model/Model'
  ],
  function (Common, EventsModel) {
    'use strict';

    QUnit.module('Model');

    QUnit.test('Should load event details', function (assert) {
      var done = assert.async();

      // Setup the model
      var oModel = new Model();
      oModel.init(true);

      oModel.loadEventDetails2(1).then(function() {
        assert.ok(oModel.getEventDetails().length === 2, 'Loaded event details');
        done();
      });
    });


  }
);
