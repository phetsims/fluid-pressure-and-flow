// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for rect, where barometers initially placed
 * @author Anton Ulyanov, Vasily Shakhov (Mlearner)
 */
define( function( require ) {
    'use strict';

    // modules
    var inherit = require( 'PHET_CORE/inherit' );
    var Node = require( 'SCENERY/nodes/Node' );
    var BarometerNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/BarometerNode' );
    var Vector2 = require( 'DOT/Vector2' );

    function BarometersContainer( model, mvt, barometersContainerBounds, layoutBounds ) {
      var barometersContainer = this;
      Node.call( this );
      model.barometers.forEach( function( barometer ) {
        barometer.position.storeInitialValue( new Vector2( barometersContainerBounds.centerX + 50, barometersContainerBounds.centerY - 15 ) );
        barometer.position.reset();
        barometersContainer.addChild( new BarometerNode( model, mvt, barometer.value, barometer.position, barometersContainerBounds, layoutBounds ) );
      } );
    }

    return inherit( Node, BarometersContainer );
  }
);