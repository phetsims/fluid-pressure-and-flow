// Copyright 2017-2022, University of Colorado Boulder

/**
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, HBox, SimpleDragHandler } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';
import Constants from '../Constants.js';
import Sensor from '../model/Sensor.js';
import VelocitySensor from '../model/VelocitySensor.js';
import BarometerNode from './BarometerNode.js';
import VelocitySensorNode from './VelocitySensorNode.js';

class SensorToolbox extends Panel {

  /**
   * @param {FlowModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {FlowScreenView} screenView
   * @param {Object} [options]
   */
  constructor( model, modelViewTransform, screenView, options ) {

    options = merge( {
      // TODO padding/margin around panel edges
    }, options );

    // create icons, not real sensors
    const velocitySensorIcon = new VelocitySensorNode(
      ModelViewTransform2.createIdentity(),
      new VelocitySensor( new Vector2( 0, 0 ), new Vector2( 0, 0 ) ),
      model.measureUnitsProperty,
      [ model.pipe.flowRateProperty, model.pipe.frictionProperty ],
      model.getVelocityAt.bind( model ),
      Bounds2.EVERYTHING, // never used for the icon
      Bounds2.EVERYTHING, // never used for the icon
      { scale: 0.9, isIcon: true }
    );

    const barometerIcon = new BarometerNode(
      ModelViewTransform2.createIdentity(),
      new Sensor( new Vector2( 0, 0 ), new Vector2( 0, 0 ) ),
      model.measureUnitsProperty,
      [ model.fluidDensityProperty, model.pipe.flowRateProperty, model.pipe.frictionProperty ],
      model.getPressureAtCoords.bind( model ),
      model.getPressureString.bind( model ),
      velocitySensorIcon.localBounds, // never used for the icon
      velocitySensorIcon.localBounds, // never used for the icon
      {
        minPressure: Constants.MIN_PRESSURE,
        maxPressure: Constants.MAX_PRESSURE,
        isIcon: true
      }
    );

    // Create the panel from the icons
    const container = new HBox( {
      children: [ velocitySensorIcon, barometerIcon ],
      spacing: 10,
      excludeInvisibleChildrenFromBounds: false
    } );

    super( container, options );

    // TODO, make sure that this is the best way to get the position of the icon in units that the sensor's positionProperty can use
    const velocitySensorInitialPosition = velocitySensorIcon.localToGlobalPoint( new Vector2( velocitySensorIcon.x, velocitySensorIcon.y ) );
    this.velocitySensorNodes = []; // @private

    // add velocitySensors within the sensor panel bounds
    _.each( model.speedometers, velocitySensor => {

      const velocitySensorNode = new VelocitySensorNode(
        modelViewTransform,
        velocitySensor,
        model.measureUnitsProperty,
        [ model.pipe.flowRateProperty, model.pipe.frictionProperty ],
        model.getVelocityAt.bind( model ),
        this.visibleBounds,
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

      this.velocitySensorNodes.push( velocitySensorNode );
      screenView.addChild( velocitySensorNode );
    } );

    velocitySensorIcon.addInputListener( SimpleDragHandler.createForwardingListener( event => {
      handleSensorVisibilityAndDrag( this.velocitySensorNodes, velocitySensorIcon, event );
    } ) );


    // TODO, make sure that this is the best way to get the position of the icon in units that the sensor's positionProperty can use
    this.barometerNodes = []; // @private

    // add barometers within the sensor panel bounds
    _.each( model.barometers, barometer => {

      const barometerNode = new BarometerNode(
        modelViewTransform,
        barometer,
        model.measureUnitsProperty,
        [ model.fluidDensityProperty, model.pipe.flowRateProperty, model.pipe.frictionProperty ],
        model.getPressureAtCoords.bind( model ),
        model.getPressureString.bind( model ),
        this.visibleBounds,
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

      this.barometerNodes.push( barometerNode );
      screenView.addChild( barometerNode );

    } );

    barometerIcon.addInputListener( DragListener.createForwardingListener( event => {
      handleSensorVisibilityAndDrag( this.barometerNodes, barometerIcon, event );
    } ) );
  }

  /**
   * @public
   */
  reset() {

    this.velocitySensorNodes.forEach( sensor => {
      sensor.visible = false;
    } );

    this.barometerNodes.forEach( sensor => {
      sensor.visible = false;
    } );
  }
}

/**
 * update the visibility of the next invisible sensor. Adjust the icon's visibility if all sensors are visible, and
 * manage the drag accordingly for the sensor
 * @param {Array.<Node>} sensors
 * @param {Node} icon
 * @param {SceneryEvent} event
 * @returns {Node|null} sensor - the first invisible sensor
 */
function handleSensorVisibilityAndDrag( sensors, icon, event ) {

  // Get the first sensor in the list that is invisible
  const getFirstInvisible = () => {
    for ( let i = 0; i < sensors.length; i++ ) {
      const sensor = sensors[ i ];
      if ( !sensor.visible ) {
        return sensor;
      }
    }
    throw new Error( 'There should always be an invisible sensor if forwarding an event.' );
  };

  const nextInvisibleSensor = getFirstInvisible();
  nextInvisibleSensor.visible = true;
  nextInvisibleSensor.dragListener.press( event );

  let visibleSensors = 0;
  for ( let i = 0; i < sensors.length; i++ ) {
    const sensor = sensors[ i ];
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

  const makeSensorVisible = () => {
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
export default SensorToolbox;