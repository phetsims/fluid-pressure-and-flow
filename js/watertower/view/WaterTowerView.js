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

    this.addChild(new Path(model.getWaterShape(),{ y: 50 + model.TANK_HEIGHT - model.waterLevel(), fill: options.waterColor}));
    this.addChild(new Path(model.getTankShape(),{ y: 50, stroke: options.towerFrameColor}));

    this.mutate(options);
  }

  return inherit( Node, WaterTowerView );

} );