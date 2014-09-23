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
   * @param {FlowModel} flowModel of the simulation
   * @param options
   * @constructor
   */
  function GridInjectorNode( flowModel, options ) {

    Node.call( this );
    var gridInjectorNode = this;

    var injector = new Image( injectorBulbImage, { scale: 0.35 } );

    this.redButton = new RoundStickyToggleButton( false, true, flowModel.isGridInjectorPressedProperty, { radius: 25, centerX: injector.centerX, top: injector.top + 31, baseColor: 'red', stroke: 'red', fill: 'red', touchExpansion: 10 } );

    // add grid injector
    gridInjectorNode.addChild( new Node( { children: [ injector, this.redButton ] } ) );

    this.mutate( options );

  }

  return inherit( Node, GridInjectorNode );
} );