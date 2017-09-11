// Copyright 2013-2015, University of Colorado Boulder

/**
 * View for the background node containing sky and ground with an option to turn off the atmosphere
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var GroundNode = require( 'SCENERY_PHET/GroundNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SkyNode = require( 'SCENERY_PHET/SkyNode' );

  /**
   * @param {UnderPressureModel} underPressureModel of the sim
   * @param {ModelViewTransform2} modelViewTransform for transforming between model and view co-ordinates
   * @constructor
   */
  function BackgroundNode( underPressureModel, modelViewTransform ) {
    Node.call( this );

    // empirically determined
    var backgroundStartX = -2000;
    var backgroundWidth = 5000;
    var skyExtension = 5000;
    var groundExtension = 5000;
    var groundY = modelViewTransform.modelToViewY( 0 );

    // add rectangle on top of the sky node to extend sky upwards.
    this.addChild( new Rectangle( backgroundStartX, -skyExtension, backgroundWidth, skyExtension,
      { stroke: '#01ACE4', fill: '#01ACE4' } ) );

    var skyNode = new SkyNode( backgroundStartX, 0, backgroundWidth, groundY, groundY );
    var skyNodeWithNoAtmosphere = new Rectangle(
      backgroundStartX,
      -skyExtension,
      backgroundWidth,
      ( skyExtension + groundY ),
      { fill: 'black' }
    );

    this.addChild( skyNode );
    this.addChild( skyNodeWithNoAtmosphere );

    underPressureModel.isAtmosphereProperty.link( function( isAtmosphere ) {
      skyNode.visible = isAtmosphere;
      skyNodeWithNoAtmosphere.visible = !isAtmosphere;
    } );

    //Ground node
    this.addChild( new GroundNode( backgroundStartX, groundY, backgroundWidth, groundY + groundExtension, 295,
      { topColor: '#93774C', bottomColor: '#93774C' } ) );
  }

  fluidPressureAndFlow.register( 'BackgroundNode', BackgroundNode );

  return inherit( Node, BackgroundNode, {} );
} );