// Copyright 2013-2017, University of Colorado Boulder

/**
 * View for the grid in Square Pool which shows horizontal lines along the pool indicating the depth.
 * Supports both english and metric units.
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */
define( require => {
  'use strict';

  // modules
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const GridLinesNode = require( 'FLUID_PRESSURE_AND_FLOW/under-pressure/view/GridLinesNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Units = require( 'FLUID_PRESSURE_AND_FLOW/common/model/Units' );

  // strings
  const readoutFeetString = require( 'string!FLUID_PRESSURE_AND_FLOW/readoutFeet' );
  const readoutMetersString = require( 'string!FLUID_PRESSURE_AND_FLOW/readoutMeters' );

  /**
   * @param {SquarePoolModel} squarePoolModel of the simulation
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinates
   * @constructor
   */
  function SquarePoolGrid( squarePoolModel, modelViewTransform ) {

    Node.call( this );
    const fontOptions = { font: new PhetFont( 12 ), fontWeight: 'bold', maxWidth: 60 };
    const poolDimensions = squarePoolModel.poolDimensions;
    // add grid lines
    this.addChild( new GridLinesNode( squarePoolModel.underPressureModel.measureUnitsProperty, modelViewTransform,
      poolDimensions.x1, poolDimensions.y1, poolDimensions.x2, poolDimensions.y2 - 0.3 ) );

    // meter labels
    const metersLabels = new Node();
    for ( let i = 0; i < 4; i++ ) {
      metersLabels.addChild( new Text( StringUtils.format( readoutMetersString, i ), _.extend( {
        right: modelViewTransform.modelToViewX( poolDimensions.x1 ) - 8,
        centerY: modelViewTransform.modelToViewY( -i )
      }, fontOptions ) ) );
    }

    // feet labels
    const feetLabels = new Node();
    for ( let i = 0; i < 11; i++ ) {
      feetLabels.addChild( new Text( StringUtils.format( readoutFeetString, i ), _.extend( {
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

  fluidPressureAndFlow.register( 'SquarePoolGrid', SquarePoolGrid );

  return inherit( Node, SquarePoolGrid );
} );