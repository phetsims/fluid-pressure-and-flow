// Copyright 2002-2013, University of Colorado Boulder

/**
 * specific grid view for trapezoid pool
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var GridLinesNode = require( 'UNDER_PRESSURE/common/view/GridLinesNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  var metersString = require( 'string!UNDER_PRESSURE/m' );
  var feetString = require( 'string!UNDER_PRESSURE/ft' );

  /**
   * Constructor for the grid view for trapezoid pool
   * @param {TrapezoidPoolModel} trapezoidPoolModel
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function TrapezoidPoolGrid( trapezoidPoolModel, modelViewTransform ) {

    Node.call( this );

    var fontOptions = {
      font: new PhetFont( 12 )
    };

    var leftEdgeOfGrid = trapezoidPoolModel.poolDimensions.leftChamber.centerTop - trapezoidPoolModel.poolDimensions.leftChamber.widthBottom / 2;
    var rightEdgeOfGrid = trapezoidPoolModel.poolDimensions.rightChamber.centerTop + trapezoidPoolModel.poolDimensions.rightChamber.widthTop / 2;
    this.addChild( new GridLinesNode( trapezoidPoolModel.globalModel, modelViewTransform, leftEdgeOfGrid, trapezoidPoolModel.poolDimensions.leftChamber.y, rightEdgeOfGrid, trapezoidPoolModel.poolDimensions.leftChamber.y + trapezoidPoolModel.poolDimensions.leftChamber.height + 0.3 ) );

    // Add the labels for meters
    var labelPosX = modelViewTransform.modelToViewX( ( trapezoidPoolModel.poolDimensions.leftChamber.centerTop + trapezoidPoolModel.poolDimensions.leftChamber.widthTop / 2 + trapezoidPoolModel.poolDimensions.rightChamber.centerTop - trapezoidPoolModel.poolDimensions.rightChamber.widthTop / 2 ) / 2 );
    var slantMultiplier = 0.45; // Empirically determined to make label line up in space between the pools.
    var depthLabelsMeters = new Node();
    for ( var depthMeters = 0; depthMeters <= trapezoidPoolModel.poolDimensions.leftChamber.height; depthMeters++ ) {
      var metersText = new Text( depthMeters + ' ' + metersString, fontOptions );
      var metersLabelRect = new Rectangle( 0, 0, metersText.width + 5, metersText.height + 5, 10, 10, {fill: '#67a257'} );
      metersText.center = metersLabelRect.center;
      metersLabelRect.addChild( metersText );
      metersLabelRect.centerX = labelPosX + modelViewTransform.modelToViewX( depthMeters * slantMultiplier );
      metersLabelRect.centerY = modelViewTransform.modelToViewY( depthMeters + trapezoidPoolModel.globalModel.skyGroundBoundY );
      depthLabelsMeters.addChild( metersLabelRect );
    }

    // Add the labels for feet, adjust for loop to limit number of labels.
    var depthLabelsFeet = new Node();
    for ( var depthFeet = 0; depthFeet <= trapezoidPoolModel.poolDimensions.leftChamber.height * 3.3 + 1; depthFeet += 5 ) {
      var feetText = new Text( depthFeet + ' ' + feetString, fontOptions );
      var feetLabelRect = new Rectangle( 0, 0, feetText.width + 5, feetText.height + 5, 10, 10, {fill: '#67a257'} );
      feetText.center = feetLabelRect.center;
      feetLabelRect.addChild( feetText );
      feetLabelRect.centerX = labelPosX + modelViewTransform.modelToViewX( depthFeet / 3.3 * slantMultiplier );
      feetLabelRect.centerY = modelViewTransform.modelToViewY( depthFeet / 3.3 + trapezoidPoolModel.globalModel.skyGroundBoundY );
      depthLabelsFeet.addChild( feetLabelRect );
    }

    this.addChild( depthLabelsMeters );
    this.addChild( depthLabelsFeet );


    trapezoidPoolModel.globalModel.measureUnitsProperty.link( function( measureUnits ) {
      depthLabelsFeet.visible = (measureUnits === 'english');
      depthLabelsMeters.visible = (measureUnits !== 'english');
    } );

    trapezoidPoolModel.globalModel.isGridVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Node, TrapezoidPoolGrid );
} );