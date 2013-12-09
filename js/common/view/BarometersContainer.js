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

  function BarometersContainer(model, x, y ) {
    Node.call( this, {x:x,y:y} );
    this.addChild(new Rectangle( 0, 0, 100, 130, 10, 10, {stroke: "black", lineWidth: 1, fill: "#f2fa6a"} ));
  }

  inherit( Node, BarometersContainer );

  return BarometersContainer;
} )
;
