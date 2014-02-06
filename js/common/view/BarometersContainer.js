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

  function BarometersContainer( model, mvt, barometersContainerBounds ) {
    var self = this;
    Node.call( this );
    model.barometers.forEach( function( barometer ) {
      self.addChild( new BarometerNode( model, mvt, barometer.value, barometer.position, barometersContainerBounds ) );
    } );
  }

  inherit( Node, BarometersContainer );

  return BarometersContainer;
} )
;
