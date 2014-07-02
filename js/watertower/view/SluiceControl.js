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
    var Node = require( 'SCENERY/nodes/Node' );
    var Rectangle = require( 'SCENERY/nodes/Rectangle' );
    var ABSwitch = require( 'SUN/ABSwitch' );
    var Text = require( 'SCENERY/nodes/Text' );
    var WaterTowerLegsNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerLegsNode' );

    var optionWidth = 60;
    var optionHeight = 50;
    var inset = 10;

    /**
     * Constructor for the sluice controller
     * @param {Property<Boolean>} isSluiceOpenProperty -- property to control the sluice gate
     * @param options
     * @constructor
     */
    function SluiceControl( isSluiceOpenProperty, options ) {

      Node.call( this );

      // close option
      var tankDim = optionHeight * 0.4;
      var closeOptionNode = new Rectangle( 0, 0, optionWidth, optionHeight, 5, 5, {stroke: 'gray', lineWidth: 1, fill: 'white'} );
      var closeWaterTowerLegs = new WaterTowerLegsNode( tankDim, tankDim, {
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
      var openOptionNode = new Rectangle( 0, 0, optionWidth, optionHeight, 5, 5, {stroke: 'gray', lineWidth: 1, fill: 'white'} );

      var openWaterTowerLegs = new WaterTowerLegsNode( tankDim, tankDim, {
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

      var waterFlow = new Path( new Shape().moveTo( 0, 0 ).quadraticCurveTo( 12, 5, 14, 25 ), {
        left: openWaterTank.right - 3,
        lineWidth: 6,
        top: openWaterTank.bottom - 8,
        stroke: '#33D6FF'
      } );
      openOptionNode.addChild( openWaterTank );
      openOptionNode.addChild( openWaterTowerLegs );
      openOptionNode.addChild( waterFlow );

      var sluicePanel = new Rectangle( 0, 0, 2 * optionWidth + 100, optionHeight + 2 * inset, 10, 10, {stroke: 'gray', lineWidth: 1, fill: 'blue'} );
      sluicePanel.addChild( new ABSwitch( isSluiceOpenProperty, false, closeOptionNode, true, openOptionNode, {left: sluicePanel.left + inset, top: sluicePanel.top + inset} ) );
      this.addChild( sluicePanel );

      this.mutate( options );
    }

    return inherit( Node, SluiceControl );
  }
);