// Copyright 2002-2013, University of Colorado Boulder

/**
 * main Model container.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var PoolWithFaucetsModel = require( 'common/model/PoolWithFaucetsModel' );
  var FaucetModel = require( 'common/model/FaucetModel' );


  function SquarePoolModel( width, height ) {
    var self = this;

    //constants, from java model
    var HEIGHT = 3; // Meters
    this.MAX_VOLUME = HEIGHT; // Liters

    this.inputFaucet = new FaucetModel( new Vector2( 3, 2.7 ), 1 );
    this.outputFaucet = new FaucetModel( new Vector2( 7.2, 6.6 ), 1 );

    PoolWithFaucetsModel.call( this, width, height );

    this.poolDimensions = {
      x1: 2.57,
      y1: self.skyGroundBoundY,
      x2: 6.57,
      y2: self.skyGroundBoundY + 3
    };

  }

  return inherit( PoolWithFaucetsModel, SquarePoolModel );
} );