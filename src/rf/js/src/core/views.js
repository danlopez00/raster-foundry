'use strict';

var L = require('leaflet'),
    _ = require('underscore'),
    Marionette = require('../../shim/backbone.marionette');

// This view houses a Leaflet instance. The map container element must exist
// in the DOM before initializing.
var MapView = Marionette.ItemView.extend({
    modelEvents: {
        'change': 'updateView'
    },

    // L.Map instance.
    _leafletMap: null,

    initialize: function() {
        var map = new L.Map(this.el);

        var layer = new L.TileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
            attribution: 'Raster Foundry | Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            maxZoom: 18
        });
        map.addLayer(layer);

        map.addControl(new L.Control.Zoom({
            position: 'bottomright'
        }));

        map.setView([39.9500, -75.1667], 13);

        // Keep the map model up-to-date with the position of the map
        this.listenTo(map, 'moveend', this.updateMapModelPosition);
        this.listenTo(map, 'zoomend', this.updateMapModelZoom);

        this._leafletMap = map;
    },

    onBeforeDestroy: function() {
        this._leafletMap.remove();
    },

    // Override the default render method because we manually update
    // the Leaflet map based on property changes on the map model.
    render: _.noop,

    // Update map position and zoom level.
    updateView: function() {
        var lat = this.model.get('lat'),
            lng = this.model.get('lng'),
            zoom = this.model.get('zoom');

        if (lat && lng && zoom) {
            this._leafletMap.setView([lat, lng], zoom);
        }
    },

    // Update the map model position and zoom level
    // based on the current position and zoom level
    // of the map. Do it silently so that we don't
    // get stuck in an update -> set -> update loop.
    updateMapModelPosition: function() {
        var center = this._leafletMap.getCenter();
        this.model.set({
            lat: center.lat,
            lng: center.lng
        }, { silent: true });
    },

    updateMapModelZoom: function() {
        var zoom = this._leafletMap.getZoom();
        this.model.set({
            zoom: zoom
        }, { silent: true });
    }
});

module.exports = {
    MapView: MapView
};