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

  function SquarePoolGrid( model, modelViewTransform ) {
    var self = this;
    Node.call( this );

    var fontOptions = {
      font: new PhetFont( 12 )
    };

    var leftEdgeOfGrid = model.poolDimensions.leftChamber.centerTop - model.poolDimensions.leftChamber.widthBottom / 2;
    var rightEdgeOfGrid = model.poolDimensions.rightChamber.centerTop + model.poolDimensions.rightChamber.widthTop / 2;
    this.addChild( new GridLinesNode( model.globalModel, modelViewTransform, leftEdgeOfGrid, model.poolDimensions.leftChamber.y, rightEdgeOfGrid, model.poolDimensions.leftChamber.y + model.poolDimensions.leftChamber.height + 0.3 ) );

    // Add the labels for meters
    var labelPosX = modelViewTransform.modelToViewX( ( model.poolDimensions.leftChamber.centerTop + model.poolDimensions.leftChamber.widthTop / 2 + model.poolDimensions.rightChamber.centerTop - model.poolDimensions.rightChamber.widthTop / 2 ) / 2 );
    var slantMultiplier = 0.45; // Empirically determined to make label line up in space between the pools.
    var depthLabelsMeters = new Node();
    for ( var depthMeters = 0; depthMeters <= model.poolDimensions.leftChamber.height; depthMeters++ ) {
      var metersText = new Text( depthMeters + ' ' + metersString, fontOptions );
      var metersLabelRect = new Rectangle( 0, 0, metersText.width + 5, metersText.height + 5, 10, 10, {fill: '#67a257'} );
      metersText.center = metersLabelRect.center;
      metersLabelRect.addChild( metersText );
      metersLabelRect.centerX = labelPosX + modelViewTransform.modelToViewX( depthMeters * slantMultiplier );
      metersLabelRect.centerY = modelViewTransform.modelToViewY( depthMeters + model.globalModel.skyGroundBoundY );
      depthLabelsMeters.addChild( metersLabelRect );
    }

    // Add the labels for feet, adjust for loop to limit number of labels.
    var depthLabelsFeet = new Node();
    for ( var depthFeet = 0; depthFeet <= model.poolDimensions.leftChamber.height * 3.3 + 1; depthFeet += 5 ) {
      var feetText = new Text( depthFeet + ' ' + feetString, fontOptions );
      var feetLabelRect = new Rectangle( 0, 0, feetText.width + 5, feetText.height + 5, 10, 10, {fill: '#67a257'} );
      feetText.center = feetLabelRect.center;
      feetLabelRect.addChild( feetText );
      feetLabelRect.centerX = labelPosX + modelViewTransform.modelToViewX( depthFeet / 3.3 * slantMultiplier );
      feetLabelRect.centerY = modelViewTransform.modelToViewY( depthFeet / 3.3 + model.globalModel.skyGroundBoundY );
      depthLabelsFeet.addChild( feetLabelRect );
    }

    this.addChild( depthLabelsMeters );
    this.addChild( depthLabelsFeet );

    model.globalModel.measureUnitsProperty.link( function( value ) {
      var metersVisible = (value !== 'english');
      depthLabelsMeters.visible = metersVisible;
      depthLabelsFeet.visible = !metersVisible;
    } );

    model.globalModel.isGridVisibleProperty.link( function( value ) {
      self.visible = value;
    } );
  }

  return inherit( Node, SquarePoolGrid );
} );