// Copyright 2013-2017, University of Colorado Boulder

/**
 * View for grid lines
 * @author Anton Ulyanov, Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Units = require( 'FLUID_PRESSURE_AND_FLOW/common/model/Units' );

  /**
   * Draw grid lines in rect (x1, y1, x2 , y2)
   * @param { Property<string> }  measureUnitsProperty takes one of 'english'/'metric'/'atmospheres'
   * @param {ModelViewTransform2} modelViewTransform to transform between model and view coordinate frames
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {Object} [options] to pass to the underlying node
   * @constructor
   */
  function GridLinesNode( measureUnitsProperty, modelViewTransform, x1, y1, x2, y2, options ) {

    Node.call( this );

    // adds a 1.5px thick line with a 1px bottom border
    const addLine = function( parentNode, viewY ) {
      const viewX1 = modelViewTransform.modelToViewX( x1 );
      const viewX2 = modelViewTransform.modelToViewX( x2 );
      parentNode.addChild( new Line( viewX1, viewY, viewX2, viewY, {
        stroke: 'rgb(192, 192, 192)',
        lineWidth: 1.5
      } ) );

      parentNode.addChild( new Line( viewX1, viewY + 1, viewX2, viewY + 1, {
        stroke: 'rgb(64, 64, 64)',
        lineWidth: 1
      } ) );
    };

    const startY = modelViewTransform.modelToViewY( y1 );
    const endY = modelViewTransform.modelToViewY( y2 );

    const metersGrid = new Node();
    const meterStep = Math.abs( modelViewTransform.modelToViewDeltaY( 1 ) );

    // add lines from startY to endY every meterStep pixels
    for ( let i = startY; i <= endY; i += meterStep ) {
      addLine( metersGrid, i );
    }

    const feetGrid = new Node();
    const feetStep = Math.abs( modelViewTransform.modelToViewDeltaY( Units.feetToMeters( 1 ) ) );

    // add lines from startY to endY every feetStep pixels
    for ( let i = startY; i <= endY; i += feetStep ) {
      addLine( feetGrid, i );
    }

    this.addChild( feetGrid );
    this.addChild( metersGrid );

    measureUnitsProperty.link( function( value ) {
      metersGrid.visible = (value !== 'english');
      feetGrid.visible = (value === 'english');
    } );

    this.mutate( options );
  }

  fluidPressureAndFlow.register( 'GridLinesNode', GridLinesNode );

  return inherit( Node, GridLinesNode );
} );
