// Copyright 2013-2014, University of Colorado Boulder

/**
 * View for the grid in Square Pool which shows horizontal lines along the pool indicating the depth.
 * Supports both english and metric units.
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var GridLinesNode = require( 'UNDER_PRESSURE/common/view/GridLinesNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Units = require( 'UNDER_PRESSURE/common/model/Units' );

  // strings
  var metersStringPattern = require( 'string!UNDER_PRESSURE/readoutMeters' );
  var feetStringPattern = require( 'string!UNDER_PRESSURE/readoutFeet' );

  /**
   * @param {SquarePoolModel} squarePoolModel of the simulation
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
   * @constructor
   */
  function SquarePoolGrid( squarePoolModel, modelViewTransform ) {

    Node.call( this );
    var fontOptions = { font: new PhetFont( 12 ), fontWeight: 'bold' };
    var poolDimensions = squarePoolModel.poolDimensions;
    // add grid lines
    this.addChild( new GridLinesNode( squarePoolModel.underPressureModel.measureUnitsProperty, modelViewTransform,
      poolDimensions.x1, poolDimensions.y1, poolDimensions.x2, poolDimensions.y2 - 0.3 ) );

    // meter labels
    var metersLabels = new Node();
    for ( var i = 0; i < 4; i++ ) {
      metersLabels.addChild( new Text( StringUtils.format( metersStringPattern, i ), _.extend( {
        right: modelViewTransform.modelToViewX( poolDimensions.x1 ) - 8,
        centerY: modelViewTransform.modelToViewY( -i )
      }, fontOptions ) ) );
    }

    // feet labels
    var feetLabels = new Node();
    for ( i = 0; i < 11; i++ ) {
      feetLabels.addChild( new Text( StringUtils.format( feetStringPattern, i ), _.extend( {
        right: modelViewTransform.modelToViewX( poolDimensions.x1 ) - 8,
        centerY: modelViewTransform.modelToViewY( -Units.feetToMeters( i ) )
      }, fontOptions ) ) );
    }

    this.addChild( metersLabels );
    this.addChild( feetLabels );

    squarePoolModel.underPressureModel.measureUnitsProperty.link( function( measureUnits ) {
      feetLabels.visible = (measureUnits === 'english');
      metersLabels.visible = (measureUnits !== 'english');
    } );

    squarePoolModel.underPressureModel.isGridVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Node, SquarePoolGrid );
} );