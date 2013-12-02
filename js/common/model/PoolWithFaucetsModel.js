// Copyright 2002-2013, University of Colorado Boulder

/**
 * Parent class for Pools with Faucets models
 * handles liquid changes(add,remove, faucets states)
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var UnderPressureModel = require( 'common/model/UnderPressureModel' );
  var FaucetModel = require( 'common/model/FaucetModel' );


  function PoolWithFaucetsModel( width, height ) {
    var self = this;

    UnderPressureModel.call( this, width, height );

    // Enable faucets and dropper based on amount of solution in the beaker.
    this.volumeProperty.link( function( volume ) {
      self.inputFaucet.enabled = ( volume < self.MAX_VOLUME );
      self.outputFaucet.enabled = ( volume > 0 );
    } );

  }

  return inherit( UnderPressureModel, PoolWithFaucetsModel, {
    step: function( dt ) {
      this.addLiquid( dt );
      this.removeLiquid( dt );
    },
    addLiquid: function( dt ) {
      var deltaVolume = this.inputFaucet.flowRate * dt;
      if ( deltaVolume > 0 ) {
        this.volume =  Math.min( this.MAX_VOLUME, this.volume + deltaVolume );
      }
    },
    removeLiquid: function( dt ) {
      var deltaVolume = this.outputFaucet.flowRate * dt;
      if ( deltaVolume > 0 ) {
        this.volume =  Math.max( 0, this.volume - deltaVolume );
      }
    }
  } );
} );