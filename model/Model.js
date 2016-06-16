/* globals _  */
/* eslint consistent-this: ["error", "self"] */
/* eslint no-warning-comments: 0 */

sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "borealis/events/util/Common",
  "borealis/events/Config"
], function(JSONModel, Common, Config) {
  "use strict";

  return JSONModel.extend("borealis.events.model.EventsModel", {

    // Lifecycle operations
    // --------------------

    init: function(_useMockData) {
      this.setData({
        // Arrays with entities
        Events: null,
        EventDetails: null,
        Equipments: null,

        // used by the form
        EventDetailData: null,

        // Lists
        Lists: {
          EventSubReason: null
        },
        EventReasonList: null,
        EventSubReasonList: null,
        EventLocalReasonList: null,

        // Flags
        FilterEventDetails: true,
        UseMockData: _useMockData,
        CntOpenAjaxCalls: 0
      });
    },

    // Events
    // ------
    //
    // Array with top level events. Displayed in the first table

    getEvent: function(idEvent) {
      var aEvents = this.getProperty('/Events');
      var oEvent = null;

      if (aEvents) {
        oEvent = aEvents.find(function(el) {
          return (el.idEvent === idEvent);
        });
      }

      return oEvent;
    },

    loadEvents: function (idShiftData) {
      var self = this;

      var params = {
        'Param.1': idShiftData,
        'Param.2': '',
        'Param.3': '',
        'Param.4': '',
        'Param.5': ''
      };
      var done = function (res) {
        self.setProperty('/Events', res);

        if (res) {
          res.forEach(function(el) {
            el.shiftDiff = parseInt(el.shiftDiff, 10);
          });
        }

      };
      Common.xhr('getEvents', 'GET', params, done);
    },

    // Events details
    // --------------
    //
    // Array with event details for one event. Displayed in the second table.

    getSavedDetailData: function(idEventDetail) {
      var aDetails = this.getProperty('/EventDetails');
      var oEventDetail = null;

      Common.debug('getSavedDetailData', aDetails);

      if (aDetails) {
        oEventDetail = aDetails.find(function(el) {
          return (el.idEventDetail === idEventDetail);
        });
      }

      return _.clone(oEventDetail);
    },

    loadEventDetails: function (idEvent) {
      var self = this;

      var params = {
        'Param.1': idEvent
      };

      var done = function (res) {
        self.setProperty('/EventDetails', res);
        res.forEach(function(el){
          el.comment = Common.rtrim(el.comment);
          el.synergyNumber = Common.rtrim(el.synergyNumber);
        });
      };

      Common.xhr('getEventDetails', 'GET', params, done);
    },

    loadEventDetails2: function (idEvent) {
      var self = this;

      var params = {
        'Param.1': idEvent
      };

      return Common.xhr2('getEventDetails', 'GET', params)
        .then(function (res) {
          self.setProperty('/EventDetails', res);
          res.forEach(function(el){
            el.comment = Common.rtrim(el.comment);
            el.synergyNumber = Common.rtrim(el.synergyNumber);
          });
          return;
        });
    },

    getEventDetails: function() {
      return this.getProperty('/EventDetails');
    },

    getMaxEndTimeForEventDetailInCurrentShift: function(idEvent, idShiftData) {
      var aDetails = this.getProperty('/EventDetails');
      var oEndTime = new Date(0);

      if (aDetails) {
        aDetails.forEach(function(el) {
          if (el.idEvent === idEvent && el.idShiftData === idShiftData) {
            oEndTime = new Date(Math.max(el.timeEndISO, oEndTime));
          }
        });
      }

      return oEndTime;
    },


    // Event detail data
    // -----------------
    //
    // Object with event detail data. Same data as in the Event details Array
    // but used for display and edit in the bottom form.

    loadEventDetailData: function (idEventDetail) {
      var oEventDetail = this.getSavedDetailData(idEventDetail);
      Common.debug('loadEventDetailData', idEventDetail, oEventDetail);
      this.setProperty('/EventDetailData', _.clone(oEventDetail));
    },

    saveEventDetailData: function (idEvent, idShiftData) {
      var self = this;
      var oDetailData = this.getProperty('/EventDetailData');

      Common.debug('saveEventDetailData', oDetailData);

      var params = {
        'Param.1': idEvent,
        'Param.2': (oDetailData.idEventDetail !== null) ? oDetailData.idEventDetail : -1,
        'Param.3': (oDetailData.idEventPerShift !== null) ? oDetailData.idEventPerShift : -1,
        'Param.4': idShiftData,
        'Param.5': oDetailData.timeStartISO.toISOString(),
        'Param.6': oDetailData.timeEndISO.toISOString(),
        'Param.7': oDetailData.classified,
        'Param.8': oDetailData.idEventReason,
        'Param.9': oDetailData.idEventSubReason,
        'Param.10': oDetailData.idEventLocalReason,
        'Param.11': (oDetailData.idEquipment !== null) ? oDetailData.idEquipment : -1,
        'Param.12': oDetailData.synergyNumber,
        'Param.13': oDetailData.comment,
        'Param.14': (oDetailData.originIdEventDetail !== null) ? oDetailData.originIdEventDetail : -1
      };

      Common.debug('saveEventDetailData,params=', params);

      // NOTE: All mii sqlQuery objects are called with GET (also insert/update)
      return Common.xhr2('saveEventDetailData', 'GET', params)
      .then(function (res) {
        Common.log('saveEventDetailData:result from ajax call:', res, idEvent);

        // Update the list with event details so the changes are visible
        self.loadEventDetails(idEvent);

        // Show the updated shift quantity
        self.loadEvents(idShiftData);

        // Do do select any event
        // TODO: Fix this self._setInitialState();
      });

    },

    clearEventDetailData: function(){
      Common.debug('clearEventDetailData');

      this.setEventDetailData(this.createEmptyEventDetail());
    },

    setEventDetailData: function(obj){
      Common.debug('setEventDetailData:', obj);

      this.setProperty('/EventDetailData', obj);
    },

    createEmptyEventDetail: function() {
      return {
        "idEventDetail": null,
        "idEvent": null,
        "idEventPerShift": null,
        "idShiftData": null,
        "timeStartISO": null,
        "timeStart": null,
        "timeEndISO": null,
        "timeEnd": null,
        "classified": new sap.ui.model.type.Float(),
        "idEventReason": null,
        "eventReasonName": null,
        "idEventSubReason": null,
        "eventSubReasonName": null,
        "idEventLocalReason": null,
        "eventLocalReasonName": null,
        "idEquipment": null,
        "comment": null,
        "synergiNumber": null
      };
    },

    getDetailData: function() {
      return this.getProperty('/EventDetailData');
    },

    getSelectedReasonId: function() {
      return this.getProperty('/EventDetailData/idEventReason');
    },

    // Lists with reason codes
    // -----------------------

    getFilterEventDetails: function() {
      return this.getProperty('/FilterEventDetails');
    },

    loadLists: function () {
      var self = this;

      [['/EventReasonList', 'EventReason'],
       ['/Lists/EventSubReason', 'EventSubReason'],
       ['/EventLocalReasonList', 'EventLocalReason', 8]
      ].forEach(function(a){
        var params = {};
        params["Param.1"] = a[1];
        if (a[2]) {
          params["Param.2"] = a[2];
        }
        var done = function (res) {
          self.setProperty(a[0], res);
        };
        Common.xhr('getLists', 'GET', params, done);
      });
    },

    // Equipments
    // ---------

    loadEquipments: function (sortString) {
      var self = this;

      if (!sortString) {
        throw new Error('EventsModel:loadEquipment: sortString is mandatory');
      }

      var params = {
        'Param.1': 'spEquipment',
        'Param.2': sortString
      };

      return Common.xhr2('spExec1', 'GET', params, this.getUseMockData())
        .then(function (res) {
          self.setProperty('/Equipments', res);
          return;
        });
    },

    getEquipments: function(){
      return this.getProperty('/Equipments');
    },

    // Misc stuf
    // ---------

    changeOpenAjaxCalls: function(i){
      this.setProperty('/CntOpenAjaxCalls', this.getProperty('/CntOpenAjaxCalls') + i);
    },

    getOpenAjaxCalls: function(){
      return this.getProperty('/CntOpenAjaxCalls');
    },

    getUseMockData: function(){
      return this.getProperty('/UseMockData');
    }

  });

});
