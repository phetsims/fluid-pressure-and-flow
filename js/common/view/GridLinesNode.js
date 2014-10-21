// Copyright 2002-2013, University of Colorado Boulder

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
  var Units = require( 'UNDER_PRESSURE/common/model/Units' );

  /**
   * Draw grid lines in rect (x1, y1, x2 , y2)
   * @param { Property<string> }  measureUnitsProperty takes one of 'english'/'metric'/'atmospheres'
   * @param {ModelViewTransform2} modelViewTransform to transform between model and view coordinate frames
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {Object} options to pass to the underlying node
   * @constructor
   */
  function GridLinesNode( measureUnitsProperty, modelViewTransform, x1, y1, x2, y2, options ) {

    Node.call( this );
    options = _.extend( {
      metersStep: 1,
      feetStep: 1
    }, options );

    var addLine = function( node, y ) {
      node.addChild( new Line( modelViewTransform.modelToViewX( x1 ), y, modelViewTransform.modelToViewX( x2 ), y,
        {stroke: 'RGB(192, 192, 192)', lineWidth: 1.5} ) );
      node.addChild( new Line( modelViewTransform.modelToViewX( x1 ), y + 1, modelViewTransform.modelToViewX( x2 ),
          y + 1, {stroke: 'RGB(64, 64, 64)', lineWidth: 1} ) );
    };

    var metersGrid = new Node();
    for ( var i = modelViewTransform.modelToViewY( y1 ); i <= modelViewTransform.modelToViewY( y2 );
          i += modelViewTransform.modelToViewY( options.metersStep ) ) {
      addLine( metersGrid, i );
    }
    var feetGrid = new Node();
    for ( i = modelViewTransform.modelToViewY( y1 ); i <= modelViewTransform.modelToViewY( y2 );
          i += modelViewTransform.modelToViewY( Units.feetToMeters( options.feetStep ) ) ) {
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
