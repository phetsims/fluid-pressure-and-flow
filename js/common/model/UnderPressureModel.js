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
  var Range = require( 'DOT/Range' );

  function UnderPressureModel( width, height ) {

    // dimensions of the model's space
    this.width = width;
    this.height = height;

    this.skyGroundBoundY = this.height * 0.42;

    this.gravityRange = new Range( 3.71, 24.92 );
    this.fluidDensityRange = new Range( 700, 1420 );

    PropertySet.call( this, {
      volume: 0, // volume of liquid in the pool, L
      isAtmosphere: true,
      isRulerVisible: false,
      isGridVisible: false,
      measureUnits: "metric",
      gravity: 9.8,
      fluidDencity: 1000
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