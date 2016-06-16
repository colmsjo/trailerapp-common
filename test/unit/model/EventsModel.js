/* globals QUnit  */

sap.ui.require(
  [
    'borealis/events/util/Common',
    'borealis/events/model/EventsModel'
  ],
  function (Common, EventsModel) {
    'use strict';

    QUnit.module('EventsModel');

    QUnit.test('Should load event details', function (assert) {
      var done = assert.async();

      // Setup the model
      var oModel = new EventsModel();
      oModel.init();

      oModel.loadEventDetails2(1).then(function() {
        assert.ok(oModel.getEventDetails().length === 2, 'Loaded event details');
        done();
      });
    });

    QUnit.test('Should find max end time in event details', function (assert) {
      var done = assert.async();

      // Setup the model
      var oModel = new EventsModel();
      oModel.init();

      oModel.loadEventDetails2(1).then(function() {
        var expected = new Date('2016-03-08T08:00:00Z');
        var d = oModel.getMaxEndTimeForEventDetailInCurrentShift(1, 19835);

        assert.deepEqual(d, expected, 'Found max end time for event detail for event 1');
        done();
      });
    });

  }
);
