// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the velocity sensors container where they are initially placed
 * @author Siddhartha Chinthapally (Actualconcepts)
 */
define( function( require ) {
    'use strict';

    // modules
    var inherit = require( 'PHET_CORE/inherit' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Vector2 = require( 'DOT/Vector2' );
    var VelocitySensorNode = require('FLUID_PRESSURE_AND_FLOW/watertower/view/VelocitySensorNode');

    function VelocitySensorsContainer( model, mvt, sensorsContainerBounds, layoutBounds ) {
      var thisContainer = this;
      Node.call( this );
      _.each(model.speedometers, function(sensor) {
        sensor.position.storeInitialValue( new Vector2(sensorsContainerBounds.centerX-70, sensorsContainerBounds.centerY - 40));
        sensor.position.reset();
        thisContainer.addChild( new VelocitySensorNode( model, mvt, sensor.value, sensor.position, sensorsContainerBounds, layoutBounds ) );
      } );
    }
    inherit( Node, VelocitySensorsContainer );

    return VelocitySensorsContainer;
  }
);