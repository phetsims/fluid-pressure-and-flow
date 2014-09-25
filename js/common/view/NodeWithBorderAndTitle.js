// Copyright 2002-2013, University of Colorado Boulder

/**
 * Node which draws a border around the given content node and puts a title at the top left embedded within the border.
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

// modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Node} contentNode around which a border has to be drawn
   * @param {string} title for the node
   * @param {Object} options
   * @constructor
   */
  function NodeWithBorderAndTitle( contentNode, title, options ) {

    this.contentNode = contentNode;
    // default options
    this.options = _.extend( {
      fill: '#f2fa6a',
      stroke: 'black',
      lineWidth: 1, // width of the background border
      xMargin: 5,
      yMargin: 10,
      cornerRadius: 5 // radius of the rounded corners on the background
    }, options );

    Node.call( this, { align: 'left' } );

    this.background = new Rectangle( -this.options.xMargin, -this.options.yMargin, contentNode.width + 2 * this.options.xMargin, contentNode.height + 2 * this.options.yMargin, this.options.cornerRadius, this.options.cornerRadius, { stroke: this.options.stroke, lineWidth: this.options.lineWidth, fill: this.options.fill } );
    this.addChild( this.background );
    this.addChild( contentNode, { y: 50 } );

    this.updateWidth( contentNode.width + 2 * this.options.xMargin );

    var titleNode = new Text( title, { font: new PhetFont( 14 ), x: 3, fontWeight: 'bold' } );
    titleNode.y = -this.options.yMargin + titleNode.height / 2 - 4;
    var titleBackground = new Rectangle( 0, titleNode.y - titleNode.height, titleNode.width + 6, titleNode.height, { fill: this.options.fill } );

    this.addChild( titleBackground );
    this.addChild( titleNode );
  }

  return inherit( Node, NodeWithBorderAndTitle, {

    updateWidth: function( width ) {
      this.background.setRect( -this.options.xMargin, -this.options.yMargin, width, this.background.height, this.options.cornerRadius, this.options.cornerRadius );
      this.contentNode.centerX = this.background.centerX;
      this.contentNode.centerY = this.background.centerY + this.options.yMargin / 2;
    }
  } );
} );