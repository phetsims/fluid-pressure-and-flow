// Copyright 2014-2017, University of Colorado Boulder

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
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var atmosphereString = require( 'string!FLUID_PRESSURE_AND_FLOW/atmosphere' );
  var offString = require( 'string!FLUID_PRESSURE_AND_FLOW/off' );
  var onString = require( 'string!FLUID_PRESSURE_AND_FLOW/on' );

  /**
   * @param {Property<Boolean>} isAtmosphereProperty - to select atmosphere on/off
   * @param {Object} [options]
   * @constructor
   */
  function AtmosphereControlNode( isAtmosphereProperty, options ) {

    // default options
    options = _.extend( {
      fill: '#f2fa6a',
      stroke: 'black',
      lineWidth: 1, // width of the background border
      xMargin: 5,
      yMargin: 6,
      cornerRadius: 5 // radius of the rounded corners on the background
    }, options );
    this.options = options;

    Node.call( this );

    var radioButtonTextOptions = { font: new PhetFont( 12 ), maxWidth: ( options.maxWidth * 0.4 || Number.POSITIVE_INFINITY ) };

    var atmosphereTrue = new AquaRadioButton( isAtmosphereProperty, true, new Text( onString, radioButtonTextOptions ), {
      radius: 6
    } );

    var atmosphereFalse = new AquaRadioButton( isAtmosphereProperty, false, new Text( offString, radioButtonTextOptions ), {
      radius: 6
    } );

    // touch areas, empirically determined
    atmosphereTrue.touchArea = atmosphereTrue.localBounds.dilatedXY( 4, 4 );
    atmosphereFalse.touchArea = atmosphereFalse.localBounds.dilatedXY( 4, 4 );

    this.contentNode = new HBox( {
      children: [ atmosphereTrue, atmosphereFalse ],
      spacing: 10
    } );

    var titleNode = new Text( atmosphereString, {
      font: new PhetFont( 14 ),
      fontWeight: 'bold',
      maxWidth: ( options.maxWidth * 0.9 || Number.POSITIVE_INFINITY )
    } );

    this.contentNode.top = titleNode.bottom + 5;
    this.addChild( titleNode );
    this.addChild( this.contentNode );

    this.mutate( this.options );
  }

  fluidPressureAndFlow.register( 'AtmosphereControlNode', AtmosphereControlNode );

  return inherit( Node, AtmosphereControlNode );
} );