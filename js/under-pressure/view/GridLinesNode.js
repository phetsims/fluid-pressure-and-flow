// Copyright 2013-2015, University of Colorado Boulder

/**
 * View for grid lines
 * @author Anton Ulyanov, Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Units = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/model/Units' );

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
    var addLine = function( parentNode, viewY ) {
      var viewX1 = modelViewTransform.modelToViewX( x1 );
      var viewX2 = modelViewTransform.modelToViewX( x2 );
      parentNode.addChild( new Line( viewX1, viewY, viewX2, viewY, {
        stroke: 'rgb(192, 192, 192)',
        lineWidth: 1.5
      } ) );

      parentNode.addChild( new Line( viewX1, viewY + 1, viewX2, viewY + 1, {
        stroke: 'rgb(64, 64, 64)',
        lineWidth: 1
      } ) );
    };

    var startY = modelViewTransform.modelToViewY( y1 );
    var endY = modelViewTransform.modelToViewY( y2 );

    var metersGrid = new Node();
    var meterStep = Math.abs( modelViewTransform.modelToViewDeltaY( 1 ) );

    // add lines from startY to endY every meterStep pixels
    for ( var i = startY; i <= endY; i += meterStep ) {
      addLine( metersGrid, i );
    }

    var feetGrid = new Node();
    var feetStep = Math.abs( modelViewTransform.modelToViewDeltaY( Units.feetToMeters( 1 ) ) );

    // add lines from startY to endY every feetStep pixels
    for ( i = startY; i <= endY; i += feetStep ) {
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

  return inherit( Node, GridLinesNode );
} );
