// Copyright 2013-2015, University of Colorado Boulder

/**
 * Fluid coming out of a faucet.
 * Origin is at the top center, to simplify alignment with the center of the faucet's output pipe.
 * @author Chris Malley (PixelZoom, Inc.), Vasily Shakhov(MLearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {FaucetModel} faucet model of the sim.
   * @param {PoolWithFaucetsModel} model square-pool/mystery-pool/trapezoid model
   * @param {ModelViewTransform2} modelViewTransform that is used to transform between model and view coordinate frames
   * @param {number} maxHeight
   * @constructor
   */
  function FaucetFluidNode( faucet, model, modelViewTransform, maxHeight ) {
    var self = this;
    Rectangle.call( self, 0, 0, 0, 0, { lineWidth: 1 } );

    this.currentHeight = 0;
    this.viewWidth = 0;

    var redrawRect = function() {
      if ( faucet.flowRateProperty.value === 0 ) {
        self.setRect( 0, 0, 0, 0 );
      }
      else {
        self.setRect( modelViewTransform.modelToViewX( faucet.location.x ) - (self.viewWidth / 2),
          modelViewTransform.modelToViewY( faucet.location.y ),
          self.viewWidth,
          self.currentHeight );
      }
    };

    model.underPressureModel.fluidColorModel.colorProperty.linkAttribute( self, 'fill' );

    faucet.flowRateProperty.link( function( flowRate ) {
      self.viewWidth = modelViewTransform.modelToViewX( faucet.spoutWidth ) * flowRate / faucet.maxFlowRate;
      redrawRect();
    } );

    model.volumeProperty.link( function( volume ) {
      self.currentHeight = maxHeight - Math.abs( modelViewTransform.modelToViewDeltaY( volume * model.maxHeight /
                                                                                       model.maxVolume ) );
      redrawRect();
    } );
  }

  fluidPressureAndFlow.register( 'FaucetFluidNode', FaucetFluidNode );

  return inherit( Rectangle, FaucetFluidNode );
} );