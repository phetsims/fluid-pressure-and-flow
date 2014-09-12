// Copyright (c) 2002 - 2014. University of Colorado Boulder

/**
 * GridInjectorNode
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RoundStickyToggleButton = require( 'SUN/Buttons/RoundStickyToggleButton' );
  var Image = require( 'SCENERY/nodes/Image' );

  // images
  var injectorBulbImage = require( 'image!FLUID_PRESSURE_AND_FLOW/injector-bulb.png' );

  /**
   * Node that injects the grid dots
   * @param {FlowModel} flowModel of the simulation
   * @param options
   * @constructor
   */
  function GridInjectorNode( flowModel, options ) {

    Node.call( this );
    var gridInjectorNode = this;

    var injector = new Image( injectorBulbImage, {scale: 0.35} );

    this.redButton = new RoundStickyToggleButton( false, true, flowModel.isGridInjectorPressedProperty, {radius: 25, centerX: injector.centerX, top: injector.top + 30, baseColor: 'red', stroke: 'red', fill: 'red', touchExpansion: 10} );

    this.gridParticleButton = new Node( {children: [injector, this.redButton]} );
    gridInjectorNode.addChild( this.gridParticleButton );
    this.mutate( options );

  }

  return inherit( Node, GridInjectorNode );
} );