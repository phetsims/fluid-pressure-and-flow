/**
 * View for the 'Water Tower' includes the tower, water, stand/legs, hose and the wheel.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Image = require( 'SCENERY/nodes/Image' );
  var WaterTowerLegsNode = require( 'FLUID_PRESSURE_AND_FLOW/watertower/view/WaterTowerLegsNode' );


  //images
  var handleImage = require( 'image!FLUID_PRESSURE_AND_FLOW/handle.png' );
  /**
   * @param {WaterTower} model
   * @param options
   * @constructor
   */
  function WaterTowerView( model, options ) {
    options = _.extend( {
      waterColor: 'rgb(20, 244, 255)',
      towerFrameColor: 'black'
    }, options );

    Node.call( this );

    this.addChild( new Path( model.getWaterShape(), { y: 20 + model.TANK_HEIGHT - model.waterLevel(), fill: options.waterColor} ) );
    var waterTankFrame = new Path( model.getTankShape(), { y: 20, stroke: options.towerFrameColor} );
    this.addChild( waterTankFrame );
    this.addChild( new WaterTowerLegsNode( 2 * model.TANK_RADIUS, model.TANK_HEIGHT * 1.15, {top: waterTankFrame.bottom} ) );
    var handleNode = new Image( handleImage, { cursor: 'pointer', scale: 0.3, top: waterTankFrame.bottom, centerX: waterTankFrame.centerX} );
    this.addChild( handleNode );
    this.mutate( options );
  }

  return inherit( Node, WaterTowerView );

} );