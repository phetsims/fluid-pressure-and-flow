// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the atmosphere control options embedded within the control panel.
 * Contains on/off radio boxes and a border around the options with a title at the top left embedded within the border.
 *
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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );

  // strings
  var atmosphereString = require( 'string!UNDER_PRESSURE/atmosphere' );
  var onString = require( 'string!UNDER_PRESSURE/on' );
  var offString = require( 'string!UNDER_PRESSURE/off' );

  /**
   * @param {Property<Boolean>} isAtmosphereProperty - to select atmosphere on/off
   * @param {Object} options
   * @constructor
   */
  function AtmosphereControlNode( isAtmosphereProperty, options ) {

    // default options
    this.options = _.extend( {
      fill: '#f2fa6a',
      stroke: 'black',
      lineWidth: 1, // width of the background border
      xMargin: 5,
      yMargin: 6,
      cornerRadius: 5 // radius of the rounded corners on the background
    }, options );

    Node.call( this );

    var textOptions = {font: new PhetFont( 12 )};

    var atmosphereTrue = new AquaRadioButton( isAtmosphereProperty, true, new Text( onString, textOptions ), {
      radius: 6
    } );

    var atmosphereFalse = new AquaRadioButton( isAtmosphereProperty, false, new Text( offString, textOptions ), {
      radius: 6
    } );

    //touch areas
    atmosphereTrue.touchArea = atmosphereTrue.localBounds.dilatedXY( 0, 0 );
    atmosphereFalse.touchArea = atmosphereFalse.localBounds.dilatedXY( 0, 0 );

    this.contentNode = new HBox( {
      children: [ atmosphereTrue, atmosphereFalse ],
      spacing: 10
    } );

    this.background = new Rectangle(
      -this.options.xMargin,
      -this.options.yMargin,
      (this.contentNode.width + 2 * this.options.xMargin),
      (this.contentNode.height + 2 * this.options.yMargin),
      this.options.cornerRadius, this.options.cornerRadius,
      {
        stroke: this.options.stroke,
        lineWidth: this.options.lineWidth,
        fill: this.options.fill
      }
    );
    this.addChild( this.background );
    this.addChild( this.contentNode, { y: 50 } );

    this.updateWidth( this.contentNode.width + 2 * this.options.xMargin );

    var titleNode = new Text( atmosphereString, { font: new PhetFont( 12 ), x: 3, fontWeight: 'bold' } );
    titleNode.y = -this.options.yMargin + titleNode.height / 2 - 4;
    var titleBackground = new Rectangle( 0, titleNode.y - titleNode.height, titleNode.width + 6, titleNode.height, {
      fill: this.options.fill
    } );

    this.addChild( titleBackground );
    this.addChild( titleNode );

    this.mutate( this.options );
  }

  return inherit( Node, AtmosphereControlNode, {

    updateWidth: function( width ) {
      this.background.setRect( -this.options.xMargin, -this.options.yMargin, width, this.background.height,
        this.options.cornerRadius, this.options.cornerRadius );
      this.contentNode.centerX = this.background.centerX;
      this.contentNode.centerY = this.background.centerY + this.options.yMargin / 2;
    }
  } );
} );