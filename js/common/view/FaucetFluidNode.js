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

  function FaucetFluidNode( faucet, model, maxHeight ) {
    var thisNode = this;
    Rectangle.call( thisNode, 0, 0, 0, 0, { lineWidth: 1 } );

    this.currentHeight = 0;
    this.viewWidth = 0;

    var redrawRect = function() {
      thisNode.setRect( faucet.location.x*model.pxToMetersRatio - (thisNode.viewWidth / 2),  faucet.location.y*model.pxToMetersRatio, thisNode.viewWidth, thisNode.currentHeight );
    };


    model.waterColorModel.waterColorProperty.link( function( color ) {
      thisNode.fill = color;
    } );

    faucet.flowRateProperty.link( function( flowRate ) {
      if ( flowRate === 0 ) {
        thisNode.setRect( 0, 0, 0, 0 );
      }
      else {
        thisNode.viewWidth = faucet.spoutWidth*model.pxToMetersRatio * flowRate / faucet.maxFlowRate;
        redrawRect();
      }
    } );

    model.volumeProperty.link(function(volume){
      thisNode.currentHeight = maxHeight - model.pxToMetersRatio*volume*model.MAX_HEIGHT/model.MAX_VOLUME;
      if(faucet.flowRate!==0) {
        redrawRect();
      }
    })



  }

  inherit( Rectangle, FaucetFluidNode );

  return FaucetFluidNode;

} );
