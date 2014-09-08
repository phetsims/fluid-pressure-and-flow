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

  function SquarePoolGrid( model, modelViewTransform ) {
    var self = this;
    Node.call( this );

    var fontOptions = {
      font: new PhetFont( 12 ),
      fontWeight: 'bold'
    };

    this.addChild( new GridLinesNode( model.globalModel, modelViewTransform, model.poolDimensions.x1, model.poolDimensions.y1, model.poolDimensions.x2, model.poolDimensions.y2 + 0.3 ) );

    var metersLabels = new Node();
    for ( var i = 0; i < 4; i++ ) {
      metersLabels.addChild( new Text( StringUtils.format( metersStringPattern, i ), _.extend( {
        right: modelViewTransform.modelToViewX( model.poolDimensions.x1 ) - 8,
        centerY: modelViewTransform.modelToViewY( model.globalModel.skyGroundBoundY + i )
      }, fontOptions ) ) );
    }

    var feetLabels = new Node();
    for ( i = 0; i < 11; i++ ) {
      feetLabels.addChild( new Text( StringUtils.format( feetStringPattern, i ), _.extend( {
        right: modelViewTransform.modelToViewX( model.poolDimensions.x1 ) - 8,
        centerY: modelViewTransform.modelToViewY( model.globalModel.skyGroundBoundY + model.globalModel.units.feetToMeters( i ) )
      }, fontOptions ) ) );
    }

    this.addChild( metersLabels );
    this.addChild( feetLabels );

    model.globalModel.measureUnitsProperty.link( function( value ) {
      var metersVisible = (value !== 'english');
      metersLabels.visible = metersVisible;
      feetLabels.visible = !metersVisible;
    } );

    model.globalModel.isGridVisibleProperty.link( function( value ) {
      self.visible = value;
    } );
  }

  return inherit( Node, SquarePoolGrid );
} );