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
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
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

    var skyNode = new SkyNode( -20000, -5000, 50000, 5000 + modelViewTransform.modelToViewY( underPressureModel.skyGroundBoundY ), modelViewTransform.modelToViewY( underPressureModel.skyGroundBoundY ) );
    var skyNodeWithNoAtmosphere = new Rectangle( -2000, -1000, 5000, 1000 + modelViewTransform.modelToViewY( underPressureModel.skyGroundBoundY ), { fill: 'black'} );

    this.addChild( skyNode );
    this.addChild( skyNodeWithNoAtmosphere );

    underPressureModel.isAtmosphereProperty.link( function( isAtmosphere ) {
        skyNode.visible = isAtmosphere;
        skyNodeWithNoAtmosphere.visible = !isAtmosphere;
    } );

    //Ground node
    this.addChild( new GroundNode( -2000, modelViewTransform.modelToViewY( underPressureModel.skyGroundBoundY ), 5000, underPressureModel.height - modelViewTransform.modelToViewY( underPressureModel.skyGroundBoundY ) + 1000, 295, {topColor: '#93774C', bottomColor: '#93774C'} ) );
  }

  return inherit( Node, BackgroundNode, {} );
} );