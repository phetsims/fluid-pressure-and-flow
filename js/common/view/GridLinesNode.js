// Copyright 2002-2013, University of Colorado Boulder

/**
 * Draw grid lines in rect (x1, y1, x2 , y2)
 * @author Anton Ulyanov, Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // Imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function GridLinesNode( model, x1, y1, x2, y2, options ) {
    //bounds of grid
    var self = this;
    Node.call( this );

    options = _.extend( {
      metersStep: 1,
      feetsStep: 1
    }, options );

    var addLine = function( node, y ) {
      node.addChild( new Line( x1 * model.pxToMetersRatio, y, x2 * model.pxToMetersRatio, y, {stroke: "RGB(192, 192, 192)", lineWidth: 1.5} ) );
      node.addChild( new Line( x1 * model.pxToMetersRatio, y + 1, x2 * model.pxToMetersRatio, y + 1, {stroke: "RGB(64, 64, 64)", lineWidth: 1} ) );
    };

    var metersGrid = new Node();
    for ( var i = y1 * model.pxToMetersRatio; i <= y2 * model.pxToMetersRatio; i += options.metersStep * model.pxToMetersRatio ) {
      addLine( metersGrid, i );
    }
    var feetsGrid = new Node();
    for ( i = y1 * model.pxToMetersRatio; i <= y2 * model.pxToMetersRatio; i += model.units.feetToMeters( options.feetsStep ) * model.pxToMetersRatio ) {
      addLine( feetsGrid, i );
    }

    this.addChild( feetsGrid );
    this.addChild( metersGrid );

    model.measureUnitsProperty.link( function( value ) {
      var metersVisible = (value !== "english");
      metersGrid.visible = metersVisible;
      feetsGrid.visible = !metersVisible;
    } );

  }


  inherit( Node, GridLinesNode );

  return GridLinesNode;
} );
