// Copyright 2017, University of Colorado Boulder

/**
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BarometerNode = require( 'FLUID_PRESSURE_AND_FLOW/common/view/BarometerNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Constants = require( 'FLUID_PRESSURE_AND_FLOW/common/Constants' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Panel = require( 'SUN/Panel' );
  var Sensor = require( 'FLUID_PRESSURE_AND_FLOW/common/model/Sensor' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var VelocitySensor = require( 'FLUID_PRESSURE_AND_FLOW/common/model/VelocitySensor' );
  var VelocitySensorNode = require( 'FLUID_PRESSURE_AND_FLOW/common/view/VelocitySensorNode' );

  /**
   *
   * @param {FlowModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {FlowScreenView} screenView
   * @param {Object} [options]
   * @constructor
   */
  function SensorToolbox( model, modelViewTransform, screenView, options ) {
    var self = this;

    options = _.extend( {
      // TODO padding/margin around panel edges
    }, options );

    // create icons, not real sensors
    var velocitySensorIcon = new VelocitySensorNode(
      ModelViewTransform2.createIdentity(),
      new VelocitySensor( new Vector2( 0, 0 ), new Vector2( 0, 0 ) ),
      model.measureUnitsProperty,
      [ model.pipe.flowRateProperty, model.pipe.frictionProperty ],
      model.getVelocityAt.bind( model ),
      Bounds2.EVERYTHING, // never used for the icon
      Bounds2.EVERYTHING,// never used for the icon
      { scale: 0.9, isIcon: true }
    );

    var barometerIcon = new BarometerNode(
      ModelViewTransform2.createIdentity(),
      new Sensor( new Vector2( 0, 0 ), new Vector2( 0, 0 ) ),
      model.measureUnitsProperty,
      [ model.fluidDensityProperty, model.pipe.flowRateProperty, model.pipe.frictionProperty ],
      model.getPressureAtCoords.bind( model ),
      model.getPressureString.bind( model ),
      velocitySensorIcon.localBounds, // never used for the icon
      velocitySensorIcon.localBounds,// never used for the icon
      {
        minPressure: Constants.MIN_PRESSURE,
        maxPressure: Constants.MAX_PRESSURE,
        isIcon: true
      }
    );

    // Create the panel from the icons
    var container = new HBox( { children: [ velocitySensorIcon, barometerIcon ], spacing: 10 } );
    Panel.call( this, container, options );

    // TODO, make sure that this is the best way to get the location of the icon in units that the sensor's positionProperty can use
    var velocitySensorInitialPosition = velocitySensorIcon.localToGlobalPoint( new Vector2( velocitySensorIcon.x, velocitySensorIcon.y ) );
    this.velocitySensorNodes = []; // @private

    // add velocitySensors within the sensor panel bounds
    _.each( model.speedometers, function( velocitySensor ) {

      var velocitySensorNode = new VelocitySensorNode(
        modelViewTransform,
        velocitySensor,
        model.measureUnitsProperty,
        [ model.pipe.flowRateProperty, model.pipe.frictionProperty ],
        model.getVelocityAt.bind( model ),
        self.visibleBounds,
        screenView.layoutBounds,
        {
          initialPosition: velocitySensorInitialPosition.roundedSymmetric(),
          scale: 0.9,
          visible: false
        }
      );

      // show the sensor icon whenever this velocity sensor is hidden back into the toolbox
      velocitySensorNode.addInputListener( getMakeIconVisibleListener( velocitySensorNode, velocitySensorIcon ) );

      // center the real velocity sensor on the icon.
      // TODO, just a hack until I find something better. I'm not sure why this is different from barometers
      velocitySensor.positionProperty._initialValue = velocitySensorInitialPosition;
      velocitySensor.positionProperty.value = velocitySensorInitialPosition;

      self.velocitySensorNodes.push( velocitySensorNode );
      screenView.addChild( velocitySensorNode );
    } );

    velocitySensorIcon.addInputListener( SimpleDragHandler.createForwardingListener( function( event ) {
      handleSensorVisibilityAndDrag( self.velocitySensorNodes, velocitySensorIcon, event );
    } ) );


    // TODO, make sure that this is the best way to get the location of the icon in units that the sensor's positionProperty can use
    this.barometerNodes = []; // @private

    // add barometers within the sensor panel bounds
    _.each( model.barometers, function( barometer ) {

      var barometerNode = new BarometerNode(
        modelViewTransform,
        barometer,
        model.measureUnitsProperty,
        [ model.fluidDensityProperty, model.pipe.flowRateProperty, model.pipe.frictionProperty ],
        model.getPressureAtCoords.bind( model ),
        model.getPressureString.bind( model ),
        self.visibleBounds,
        screenView.layoutBounds,
        {
          minPressure: Constants.MIN_PRESSURE,
          maxPressure: Constants.MAX_PRESSURE,
          scale: 0.9,
          visible: false,
          initialPosition: barometer.positionProperty.get()
        }
      );

      // show the sensor icon whenever this barometer is hidden back into the toolbox
      barometerNode.addInputListener( getMakeIconVisibleListener( barometerNode, barometerIcon ) );

      self.barometerNodes.push( barometerNode );
      screenView.addChild( barometerNode );

    } );

    barometerIcon.addInputListener( SimpleDragHandler.createForwardingListener( function( event ) {
      handleSensorVisibilityAndDrag( self.barometerNodes, barometerIcon, event );

    } ) );
  }

  /**
   * update the visibility of the next invisible sensor. Adjust the icon's visibility if all sensors are visible, and
   * manage the drag accordingly for the sensor
   * @param {Array.<Node>} sensors
   * @param {Node} icon
   * @param {Event} event
   * @returns {Node|null} sensor - the first invisible sensor
   */
  function handleSensorVisibilityAndDrag( sensors, icon, event ) {


    // Get the first sensor in the list that is invisible
    var getFirstInvisible = function() {
      for ( var i = 0; i < sensors.length; i++ ) {
        var sensor = sensors[ i ];
        if ( !sensor.visible ) {
          return sensor;
        }
      }
      assert && assert( false, 'There should always be an invisible sensor if forwarding an event.' );
    };

    var nextInvisibleSensor = getFirstInvisible();

    nextInvisibleSensor.visible = true;
    nextInvisibleSensor.moveToFront();
    nextInvisibleSensor.dragListener.startDrag( event );


    var visibleSensors = 0;
    for ( var i = 0; i < sensors.length; i++ ) {
      var sensor = sensors[ i ];
      if ( sensor.visible ) {
        visibleSensors += 1;
      }
    }

    icon.visible = !( visibleSensors === sensors.length );
  }

  /**
   * Given a sensor and it's icon, get the listener needed to show the icon when the sensor is made invisible
   * (put back in the toolbox).
   * @param sensorNode
   * @param icon
   * @returns {{up: function, cancel: function}} - the listener object
   */
  function getMakeIconVisibleListener( sensorNode, icon ) {
    var makeSensorVisible = function() {
      if ( sensorNode.visible === false ) {
        icon.visible = true;
      }
    };

    // TODO: SR is the 'up' event robust enough here? I'm trying to add on to the enddrag of the sensorNode
    return {
      up: makeSensorVisible,
      cancel: makeSensorVisible
    };
  }

  fluidPressureAndFlow.register( 'SensorToolbox', SensorToolbox );

  return inherit( Panel, SensorToolbox, {

    reset: function() {
      this.velocitySensorNodes.forEach( function( sensor ) {
        sensor.visible = false;
      } );
      this.barometerNodes.forEach( function( sensor ) {
        sensor.visible = false;
      } );
    }
  } );
} );