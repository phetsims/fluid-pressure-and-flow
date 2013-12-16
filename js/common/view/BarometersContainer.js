// Copyright 2002-2013, University of Colorado Boulder

/**
 * Slider and button for changing fluid density and gravitation.
 *
 * @author Anton Ulyanov, Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // Imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var BarometerNode = require( "UNDER_PRESSURE/common/view/BarometerNode" );

  function BarometersContainer( model ) {
    var self = this;
    Node.call( this );
    model.barometersStatement.forEach( function( positionProperty ) {
      self.addChild( new BarometerNode( model, positionProperty ) );
    } );
  }

  inherit( Node, BarometersContainer );

  return BarometersContainer;
} )
;
