// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the background node containing sky and ground with an option to turned off the atmosphere
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SkyNode = require( 'SCENERY_PHET/SkyNode' );
  var GroundNode = require( 'SCENERY_PHET/GroundNode' );

  /**
   * @param {UnderPressureModel} underPressureModel of the sim
   * @param {ModelViewTransform2} modelViewTransform for transforming between model and view co-ordinates
   * @constructor
   */
  function BackgroundNode( underPressureModel, modelViewTransform ) {
    Node.call( this );

    var backgroundStartX = -2000;
    var backgroundWidth = 5000;
    var skyExtension = 5000;
    var groundExtension = 5000;

    var skyNode = new SkyNode( backgroundStartX, -skyExtension, backgroundWidth,
        skyExtension + modelViewTransform.modelToViewY( underPressureModel.skyGroundBoundY ),
      modelViewTransform.modelToViewY( underPressureModel.skyGroundBoundY ) );
    var skyNodeWithNoAtmosphere = new Rectangle( backgroundStartX, -skyExtension, backgroundWidth,
        skyExtension + modelViewTransform.modelToViewY( underPressureModel.skyGroundBoundY ), { fill: 'black'} );

    this.addChild( skyNode );
    this.addChild( skyNodeWithNoAtmosphere );

    underPressureModel.isAtmosphereProperty.link( function( isAtmosphere ) {
      skyNode.visible = isAtmosphere;
      skyNodeWithNoAtmosphere.visible = !isAtmosphere;
    } );

    //Ground node
    this.addChild( new GroundNode( backgroundStartX,
      modelViewTransform.modelToViewY( underPressureModel.skyGroundBoundY ), backgroundWidth,
        underPressureModel.height - modelViewTransform.modelToViewY( underPressureModel.skyGroundBoundY ) +
        groundExtension, 295,
      {topColor: '#93774C', bottomColor: '#93774C'} ) );
  }

  return inherit( Node, BackgroundNode, {} );
} );