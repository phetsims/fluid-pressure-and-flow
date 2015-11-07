// Copyright 2013-2015, University of Colorado Boulder

/**
 * View for the grid in trapezoid and chamber pools which shows horizontal lines along the pool indicating the depth.
 * Callouts indicating depth are shown on the lines with an option (slantMultiplier) to show them horizontally displaced compared with
 * the ones on the above and below lines. Supports both english and metric units.
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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  var metersString = require( 'string!UNDER_PRESSURE/m' );
  var feetString = require( 'string!UNDER_PRESSURE/ft' );
  var valueWithUnitsPattern = require( 'string!UNDER_PRESSURE/valueWithUnitsPattern' );

  /**
   * @param {UnderPressureModel} underPressureModel of the sim
   * @param {ModelViewTransform2 } modelViewTransform to convert between model and view co-ordinates
   * @param {number} poolLeftX is pool left x coordinate
   * @param {number} poolTopY is pool top y coordinate
   * @param {number} poolRightX is pool right x coordinate
   * @param {number} poolBottomY is pool bottom y coordinate
   * @param {number} poolHeight is height of the pool
   * @param {number} labelXPosition is label x position
   * @param {number} slantMultiplier is to make label line up in space between the pools
   * @constructor
   */
  function TrapezoidPoolGrid( underPressureModel, modelViewTransform, poolLeftX, poolTopY, poolRightX, poolBottomY,
                              poolHeight, labelXPosition, slantMultiplier ) {

    Node.call( this );
    var fontOptions = { font: new PhetFont( 12 ) };

    // add grid line
    this.addChild( new GridLinesNode( underPressureModel.measureUnitsProperty, modelViewTransform, poolLeftX, poolTopY,
      poolRightX, poolBottomY ) );

    // Add the labels for meters
    var depthLabelsMeters = new Node();
    for ( var depthMeters = 0; depthMeters <= poolHeight; depthMeters++ ) {
      var metersText = new Text( StringUtils.format( valueWithUnitsPattern, depthMeters, metersString ), fontOptions );
      var metersLabelRect = new Rectangle( 0, 0, metersText.width + 5, metersText.height + 5, 10, 10,
        { fill: '#67a257' } );
      metersText.center = metersLabelRect.center;
      metersLabelRect.addChild( metersText );
      metersLabelRect.centerX = labelXPosition + modelViewTransform.modelToViewX( depthMeters * slantMultiplier );
      metersLabelRect.centerY = modelViewTransform.modelToViewY( -depthMeters );
      depthLabelsMeters.addChild( metersLabelRect );
    }

    // Add the labels for feet, adjust for loop to limit number of labels.
    var depthLabelsFeet = new Node();
    for ( var depthFeet = 0; depthFeet <= poolHeight * 3.3 + 1; depthFeet += 5 ) {
      var feetText = new Text( StringUtils.format( valueWithUnitsPattern, depthFeet, feetString ), fontOptions );
      var feetLabelRect = new Rectangle( 0, 0, feetText.width + 5, feetText.height + 5, 10, 10, { fill: '#67a257' } );
      feetText.center = feetLabelRect.center;
      feetLabelRect.addChild( feetText );
      feetLabelRect.centerX = labelXPosition +
                              modelViewTransform.modelToViewDeltaX( depthFeet / 3.3 * slantMultiplier );
      feetLabelRect.centerY = modelViewTransform.modelToViewY( -depthFeet / 3.3 );
      depthLabelsFeet.addChild( feetLabelRect );
    }

    this.addChild( depthLabelsMeters );
    this.addChild( depthLabelsFeet );

    underPressureModel.measureUnitsProperty.link( function( measureUnits ) {
      depthLabelsFeet.visible = (measureUnits === 'english');
      depthLabelsMeters.visible = (measureUnits !== 'english');
    } );

    underPressureModel.isGridVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Node, TrapezoidPoolGrid );
} );