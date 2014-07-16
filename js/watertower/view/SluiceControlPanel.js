// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * View for the sluice state (open/close) switcher
 * @author Siddhartha Chinthapally (Actual Concepts) on 6/23/2014.
 */
define( function( require ) {
    'use strict';

    // modules
    var inherit = require( 'PHET_CORE/inherit' );
    var Path = require( 'SCENERY/nodes/Path' );
    var Shape = require( 'KITE/Shape' );
    var Panel = require( 'SUN/Panel' );
    var Rectangle = require( 'SCENERY/nodes/Rectangle' );
    var ABSwitch = require( 'SUN/ABSwitch' );
    var WaterTowerLegsNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerLegsNode' );
    var Vector2 = require( 'DOT/Vector2' );
    var Property = require( 'AXON/Property' );
    var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );

    // constants
    var optionWidth = 48;
    var optionHeight = 36;
    var inset = 10;

    /**
     * Constructor for the sluice controller
     * @param {Property<Boolean>} isSluiceOpenProperty -- property to control the sluice gate
     * @param options
     * @constructor
     */
    function SluiceControlPanel( isSluiceOpenProperty, options ) {

      var tankDim = optionWidth * 0.33;
      var tankPositionProperty = new Property( new Vector2( 0, -0.7 * tankDim ) );
      var modelViewTransform = ModelViewTransform2.createIdentity();

      // close option
      var closeOptionNode = new Rectangle( 0, 0, optionWidth, optionHeight, 5, 5, {stroke: 'black', lineWidth: 1, fill: 'white'} );

      var closeWaterTowerLegs = new WaterTowerLegsNode( tankDim, tankPositionProperty, modelViewTransform, {
        legWidth: 1,
        crossbeamWidth: 1,
        bottom: closeOptionNode.bottom,
        left: closeOptionNode.centerX - tankDim / 2
      } );

      var closeWaterTank = new Rectangle( 0, 0, tankDim, tankDim, {
        stroke: 'gray',
        lineWidth: 1,
        fill: '#33D6FF',
        bottom: closeWaterTowerLegs.top,
        left: closeWaterTowerLegs.left
      } );

      closeOptionNode.addChild( closeWaterTank );
      closeOptionNode.addChild( closeWaterTowerLegs );

      // open option
      var openOptionNode = new Rectangle( 0, 0, optionWidth, optionHeight, 5, 5, {stroke: 'black', lineWidth: 1, fill: 'white'} );

      var openWaterTowerLegs = new WaterTowerLegsNode( tankDim, tankPositionProperty, modelViewTransform, {
        legWidth: 1,
        crossbeamWidth: 1,
        bottom: openOptionNode.bottom,
        left: openOptionNode.centerX - tankDim / 2
      } );

      var openWaterTank = new Rectangle( 0, 0, tankDim, tankDim, {
        stroke: 'gray',
        lineWidth: 1,
        fill: '#33D6FF',
        bottom: openWaterTowerLegs.top,
        left: openWaterTowerLegs.left
      } );

      var waterFlow = new Path( new Shape().moveTo( 0, 0 ).quadraticCurveTo( 10, 0, 13, 15 ), {
        left: openWaterTank.right - 3,
        lineWidth: 4,
        top: openWaterTank.bottom - 6,
        stroke: '#33D6FF'
      } );
      openOptionNode.addChild( openWaterTank );
      openOptionNode.addChild( openWaterTowerLegs );
      openOptionNode.addChild( waterFlow );

      Panel.call( this, new ABSwitch( isSluiceOpenProperty, false, closeOptionNode, true, openOptionNode, {left: inset, top: inset} ), options );
    }

    return inherit( Panel, SluiceControlPanel );
  }
);