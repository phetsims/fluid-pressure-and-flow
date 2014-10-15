// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for water in trapezoid pool
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  /**
   * Constructor for the grid view for trapezoid pool
   * @param {TrapezoidPoolModel} trapezoidPoolModel
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
   * @constructor
   */
  function TrapezoidPoolWaterNode( trapezoidPoolModel, modelViewTransform ) {

    Node.call( this );
    var waterPath = new Path();

    var yMax = modelViewTransform.modelToViewY( trapezoidPoolModel.poolDimensions.leftChamber.y +
                                                trapezoidPoolModel.poolDimensions.leftChamber.height );//bottom y coord of pool, px
    var x1 = modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x1bottom ); //bottom left corner of the pool
    var x4 = modelViewTransform.modelToViewX( trapezoidPoolModel.verticles.x4bottom ); //bottom right corner of the pool

    trapezoidPoolModel.underPressureModel.fluidColorModel.colorProperty.linkAttribute( waterPath, 'fill' );

    trapezoidPoolModel.volumeProperty.link( function() {
      var viewHeight = trapezoidPoolModel.maxHeight * trapezoidPoolModel.volume / trapezoidPoolModel.maxVolume; //height of water
      var topY = yMax - modelViewTransform.modelToViewY( viewHeight ); //y coord for top of the water
      var h = Math.min( viewHeight, trapezoidPoolModel.poolDimensions.bottomChamber.y2 -
                                    trapezoidPoolModel.poolDimensions.bottomChamber.y1 ); //height in bottom passage

      waterPath.shape = new Shape()
        .moveTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.leftChamber.leftBorderFunction( viewHeight ) ),
        topY )
        .lineTo( x1, yMax )
        .lineTo( x4, yMax )
        .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.rightChamber.rightBorderFunction( viewHeight ) ),
        topY )
        .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.rightChamber.leftBorderFunction( viewHeight ) ),
        topY )
        .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.rightChamber.leftBorderFunction( h ) ),
          yMax - modelViewTransform.modelToViewY( h ) )
        .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.leftChamber.rightBorderFunction( h ) ),
          yMax - modelViewTransform.modelToViewY( h ) )
        .lineTo( modelViewTransform.modelToViewX( trapezoidPoolModel.poolDimensions.leftChamber.rightBorderFunction( viewHeight ) ),
        topY );

    } );

    this.addChild( waterPath );
  }

  return inherit( Node, TrapezoidPoolWaterNode );
} );