// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for rect, where barometers initially placed
 * @author Anton Ulyanov, Vasily Shakhov (Mlearner)
 */
define( function( require ) {
    'use strict';

    // Imports
    var inherit = require( 'PHET_CORE/inherit' );
    var Node = require( 'SCENERY/nodes/Node' );
    var BarometerNode = require( 'UNDER_PRESSURE/common/view/BarometerNode' );
    var Vector2 = require( 'DOT/Vector2' );

    function BarometersContainer( model, mvt, barometersContainerBounds, view ) {
      var self = this;
      Node.call( this );
      model.barometers.forEach( function( barometer ) {
        barometer.position.storeInitialValue( new Vector2( barometersContainerBounds.centerX, barometersContainerBounds.centerY - 15 ) );
        barometer.position.reset();
        self.addChild( new BarometerNode( model, mvt, barometer.value, barometer.position, barometersContainerBounds, view ) );
      } );
    }

    inherit( Node, BarometersContainer );

    return BarometersContainer;
  }
);