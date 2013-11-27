// Copyright 2002-2013, University of Colorado Boulder

/**
 * Fluid coming out of a faucet.
 * Origin is at the top center, to simplify alignment with the center of the faucet's output pipe.
 *
 * @author Chris Malley (PixelZoom, Inc.), Vasily Shakhov(MLearner)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function FaucetFluidNode( faucet, model, height ) {
    var thisNode = this;
    Rectangle.call( thisNode, 0, 0, 0, 0, { lineWidth: 1 } );

    //TODO
    thisNode.fill = "blue";

    faucet.flowRateProperty.link( function( flowRate ) {
      if ( flowRate === 0 ) {
        thisNode.setRect( 0, 0, 0, 0 );
      }
      else {
        var viewWidth = faucet.spoutWidth * flowRate / faucet.maxFlowRate;
        thisNode.setRect( faucet.location.x - (viewWidth / 2),  faucet.location.y, viewWidth, height );
      }
    } );
  }

  inherit( Rectangle, FaucetFluidNode );

  return FaucetFluidNode;

} );
