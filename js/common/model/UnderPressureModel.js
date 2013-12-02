// Copyright 2002-2013, University of Colorado Boulder

/**
 * top model for all screens,
 * all common properties and methods are placed here
 * @author Vasily Shakhov (Mlearner)
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
    this.skyGroundBoundY = 3.14; // M

    this.pxToMetersRatio = 70; // 70px = 1 M

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