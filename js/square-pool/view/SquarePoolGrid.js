// Copyright 2002-2013, University of Colorado Boulder

/**
 * specific view for square pool grid
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var GridLinesNode = require( 'UNDER_PRESSURE/common/view/GridLinesNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  var metersStringPattern = require( 'string!UNDER_PRESSURE/readoutMeters' );
  var feetStringPattern = require( 'string!UNDER_PRESSURE/readoutFeet' );

  /**
   * View for the grid inside square pool
   * @param {SquarePoolModel} squarePoolModel
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function SquarePoolGrid( squarePoolModel, modelViewTransform ) {
    Node.call( this );

    var fontOptions = {
      font: new PhetFont( 12 ),
      fontWeight: 'bold'
    };

    this.addChild( new GridLinesNode( squarePoolModel.globalModel, modelViewTransform, squarePoolModel.poolDimensions.x1, squarePoolModel.poolDimensions.y1, squarePoolModel.poolDimensions.x2, squarePoolModel.poolDimensions.y2 + 0.3 ) );

    var metersLabels = new Node();
    for ( var i = 0; i < 4; i++ ) {
      metersLabels.addChild( new Text( StringUtils.format( metersStringPattern, i ), _.extend( {
        right: modelViewTransform.modelToViewX( squarePoolModel.poolDimensions.x1 ) - 8,
        centerY: modelViewTransform.modelToViewY( squarePoolModel.globalModel.skyGroundBoundY + i )
      }, fontOptions ) ) );
    }

    var feetLabels = new Node();
    for ( i = 0; i < 11; i++ ) {
      feetLabels.addChild( new Text( StringUtils.format( feetStringPattern, i ), _.extend( {
        right: modelViewTransform.modelToViewX( squarePoolModel.poolDimensions.x1 ) - 8,
        centerY: modelViewTransform.modelToViewY( squarePoolModel.globalModel.skyGroundBoundY + squarePoolModel.globalModel.units.feetToMeters( i ) )
      }, fontOptions ) ) );
    }

    this.addChild( metersLabels );
    this.addChild( feetLabels );

    squarePoolModel.globalModel.measureUnitsProperty.valueEquals( 'english' ).linkAttribute( feetLabels, 'visible' );
    squarePoolModel.globalModel.measureUnitsProperty.valueEquals( 'metric' ).linkAttribute( metersLabels, 'visible' );

    squarePoolModel.globalModel.isGridVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Node, SquarePoolGrid );
} );