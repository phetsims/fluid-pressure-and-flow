// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * View for the GridInjectorNode that injects a particle grid into the pipe.
 * The injector looks like a red button with yellow extended background and a tapered funnel at the bottom.
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RoundStickyToggleButton = require( 'SUN/Buttons/RoundStickyToggleButton' );
  var Image = require( 'SCENERY/nodes/Image' );

  // images
  var injectorBulbImage = require( 'image!FLUID_PRESSURE_AND_FLOW/injector-bulb-cropped.png' );

  /**
   * Node that injects the grid dots
   * @param {Property<Boolean>} isGridInjectorPressedProperty indicates whether the injector is pressed or not
   * @param {modelViewTransform} modelViewTransform , Transform between model and view coordinate frames
   * @param {Pipe} pipe model of the simulation
   * @param {Object} options that can be passed on to the underlying node
   * @constructor
   */
  function GridInjectorNode( isGridInjectorPressedProperty, modelViewTransform, pipe, options ) {

    Node.call( this );

    this.modelViewTransform = modelViewTransform;
    this.pipe = pipe;
    this.gridInjectorNodeXOffset = 50;
    this.gridInjectorNodeYOffset = 150;
    this.gridInjectorX = -6; // model value

    var injector = new Image( injectorBulbImage, { scale: 0.35 } );

    this.redButton = new RoundStickyToggleButton( false, true, isGridInjectorPressedProperty,
      {
        radius: 25,
        centerX: injector.centerX,
        top: injector.top + 31,
        baseColor: 'red',
        stroke: 'red',
        fill: 'red',
        touchExpansion: 10
      } );

    // add grid injector
    this.gridInjector = new Node( { children: [ injector, this.redButton ] } );
    this.addChild( this.gridInjector );
    this.updateGridInjector();

    this.mutate( options );

  }

  return inherit( Node, GridInjectorNode, {

    // reposition the grid injector
    updateGridInjector: function() {
      this.gridInjector.setTranslation( this.modelViewTransform.modelToViewX( this.gridInjectorX ) -
                                        this.gridInjectorNodeXOffset,
          this.modelViewTransform.modelToViewY( this.pipe.getCrossSection( this.gridInjectorX ).yTop ) -
          this.gridInjectorNodeYOffset );
    }
  } );
} );