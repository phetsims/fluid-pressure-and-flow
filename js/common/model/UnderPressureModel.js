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

  function UnderPressureModel(width, height) {

    // dimensions of the model's space
    this.width = width;
    this.height = height;

    this.skyGroundBoundY = this.height * 0.42;


    PropertySet.call( this, {
      volume: 0, // volume of liquid in the pool, L
      isAtmosphere: true
    } );

  }

  return inherit( PropertySet, UnderPressureModel, {
    step: function( dt ) {
    },
    reset: function() {
      this.volumeProperty.reset();
      this.isAtmosphereProperty.reset();
    }
  } );
} );