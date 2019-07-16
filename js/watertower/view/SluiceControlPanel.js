// Copyright 2014-2019, University of Colorado Boulder

/**
 * View for the sluice state (open/close) switcher
 * @author Siddhartha Chinthapally (Actual Concepts) on 6/23/2014.
 */
define( function( require ) {
  'use strict';

  // modules
  const ABSwitch = require( 'SUN/ABSwitch' );
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const WaterTowerLegsNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerLegsNode' );

  // constants
  const optionWidth = 48;
  const optionHeight = 36;

  /**
   * Constructor for the sluice controller
   * @param {Property.<boolean>} isSluiceOpenProperty -- property to control the sluice gate
   * @param {Object} [options]
   * @constructor
   */
  function SluiceControlPanel( isSluiceOpenProperty, options ) {

    // these things are used to create WaterTowerLegsNode
    const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( Vector2.ZERO, Vector2.ZERO, 1 ); // identity with y-axis inverted
    const tankDim = optionWidth * 0.33;
    const tankPositionProperty = new Vector2Property( new Vector2( 0, 0.7 * tankDim ) );

    // close option
    const closeOptionNode = new Rectangle( 0, 0, optionWidth, optionHeight, 5, 5, {
      stroke: 'black',
      lineWidth: 1,
      fill: 'white'
    } );

    const closeWaterTowerLegs = new WaterTowerLegsNode( tankDim, tankPositionProperty, modelViewTransform, {
      legWidth: 1,
      crossbeamWidth: 1,
      bottom: closeOptionNode.bottom,
      left: closeOptionNode.centerX - tankDim / 2
    } );

    const closeWaterTank = new Rectangle( 0, 0, tankDim, tankDim, {
      stroke: 'gray',
      lineWidth: 1,
      fill: '#33D6FF',
      bottom: closeWaterTowerLegs.top,
      left: closeWaterTowerLegs.left
    } );

    closeOptionNode.addChild( closeWaterTank );
    closeOptionNode.addChild( closeWaterTowerLegs );

    // open option
    const openOptionNode = new Rectangle( 0, 0, optionWidth, optionHeight, 5, 5, {
      stroke: 'black',
      lineWidth: 1,
      fill: 'white'
    } );

    const openWaterTowerLegs = new WaterTowerLegsNode( tankDim, tankPositionProperty, modelViewTransform, {
      legWidth: 1,
      crossbeamWidth: 1,
      bottom: openOptionNode.bottom,
      left: openOptionNode.centerX - tankDim / 2
    } );

    const openWaterTank = new Rectangle( 0, 0, tankDim, tankDim, {
      stroke: 'gray',
      lineWidth: 1,
      fill: '#33D6FF',
      bottom: openWaterTowerLegs.top,
      left: openWaterTowerLegs.left
    } );

    const waterFlow = new Path( new Shape().moveTo( 0, 0 ).quadraticCurveTo( 10, 0, 13, 15 ), {
      left: openWaterTank.right - 3,
      lineWidth: 4,
      top: openWaterTank.bottom - 6,
      stroke: '#33D6FF'
    } );
    openOptionNode.addChild( openWaterTank );
    openOptionNode.addChild( openWaterTowerLegs );
    openOptionNode.addChild( waterFlow );

    ABSwitch.call( this, isSluiceOpenProperty, false, closeOptionNode, true, openOptionNode, options );
  }

  fluidPressureAndFlow.register( 'SluiceControlPanel', SluiceControlPanel );

  return inherit( ABSwitch, SluiceControlPanel );
} );