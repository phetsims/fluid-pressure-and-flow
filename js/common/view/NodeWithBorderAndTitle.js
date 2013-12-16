// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node button group. Add border and title to the group.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function NodeWithBorderAndTitle( contentNode, title, options ) {
    var self = this;

    // default options
    options = _.extend( {
      fill: "#f2fa6a",
      stroke: "black",
      lineWidth: 1, // width of the background border
      xMargin: 5,
      yMargin: 10,
      cornerRadius: 5 // radius of the rounded corners on the background
    }, options );

    Node.call( this, {align: "left"} );

    var background = new Rectangle( -options.xMargin, -options.yMargin, contentNode.width + 2 * options.xMargin, contentNode.height + 2 * options.yMargin, options.cornerRadius, options.cornerRadius, {stroke: options.stroke, lineWidth: options.lineWidth, fill: options.fill} );
    this.addChild( background );
    this.addChild( contentNode, {y: 50} );
    contentNode.centerX = background.centerX;
    contentNode.centerY = background.centerY + options.yMargin / 2;

    var title = new Text( title, {font: new PhetFont( 14 ), x: 3, fontWeight: "bold"} );
    title.y = -options.yMargin + title.height / 2 - 4;
    var titleBackground = new Rectangle( 0, title.y - title.height, title.width + 6, title.height, {fill: options.fill} );

    this.addChild( titleBackground );
    this.addChild( title );


  }

  return inherit( Node, NodeWithBorderAndTitle );
} );