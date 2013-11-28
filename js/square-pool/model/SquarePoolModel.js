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

    PoolWithFaucetsModel.call( this, width, height );

    this.poolDimensions = {
      x1: 180,
      y1: self.skyGroundBoundY,
      x2: 480,
      y2: self.skyGroundBoundY + 210
    };

  }

  return inherit( PoolWithFaucetsModel, SquarePoolModel );
} );