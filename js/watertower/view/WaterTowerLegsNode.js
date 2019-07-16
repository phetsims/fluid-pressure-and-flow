// Copyright 2014-2017, University of Colorado Boulder

/**
 * WaterTowerLegsNode
 * @author Siddhartha Chinthapally (Actual Concepts) on 6/24/2014.
 */
define( function( require ) {
  'use strict';

  // modules
  const fluidPressureAndFlow = require( 'FLUID_PRESSURE_AND_FLOW/fluidPressureAndFlow' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );

  /**
   *
   * @param {number} width between the right and left legs at the bottom
   * @param {Property.<Vector2>} tankPositionProperty which can be observed to change the height of the legs. tankPosition.y forms the top bound of the waterTowerLegs w.r.t to the modelViewTransform used.
   * @param {ModelViewTransform2} modelViewTransform to convert between view and model values
   * @param {Object} [options]
   * @constructor
   */
  function WaterTowerLegsNode( width, tankPositionProperty, modelViewTransform, options ) {

    Node.call( this );

    options = _.extend( {
      legWidth: 10,
      crossbeamWidth: 4
    }, options );
    this.options = options; // @private

    var legPaintOptions = { stroke: 'black', lineWidth: 1, fill: 'black' };
    var crossbeamPaintOptions = { stroke: 'black', lineWidth: this.options.crossbeamWidth };

    this.waterTowerWidth = width;
    this.waterTowerHeight = 0;  // will be set to correct value by tankPositionProperty observer below

    this.leftLegPath = new Path( null, legPaintOptions );
    this.rightLegPath = new Path( null, legPaintOptions );
    this.crossbeam1Path = new Line( 0, 0, 0, 0, crossbeamPaintOptions );
    this.crossbeam2Path = new Line( 0, 0, 0, 0, crossbeamPaintOptions );
    this.crossbeam3Path = new Line( 0, 0, 0, 0, crossbeamPaintOptions );
    this.crossbeam4Path = new Line( 0, 0, 0, 0, crossbeamPaintOptions );
    this.children = [ this.leftLegPath, this.rightLegPath, this.crossbeam1Path, this.crossbeam2Path, this.crossbeam3Path, this.crossbeam4Path ];

    tankPositionProperty.link( function( tankPosition ) {
      // update the legs
      this.waterTowerHeight = -modelViewTransform.modelToViewDeltaY( tankPosition.y );
      this.updateShape();
    }.bind( this ) );

    this.mutate( this.options );
  }

  fluidPressureAndFlow.register( 'WaterTowerLegsNode', WaterTowerLegsNode );

  return inherit( Node, WaterTowerLegsNode, {

    /**
     * Update the shape of the water tower legs when the water tower has been raised or lowered.
     * @private
     */
    updateShape: function() {

      var width = this.waterTowerWidth;
      var height = this.waterTowerHeight;
      var leftLegTopX = width * 0.2;
      var rightLegTopX = width * 0.8;
      var options = this.options;

      // use 1 instead of 0 when the height is 0. This is to prevent divide by zero and other problems.
      var fLeftLegX = function( y ) {
        return Util.linear( 0, height > 0 ? height : 1, leftLegTopX, 0, y ); //y1, y2, x1, x2
      };

      var fRightLegX = function( y ) {
        return Util.linear( 0, height > 0 ? height : 1, rightLegTopX, width, y );
      };

      //Left leg
      this.leftLegPath.setShape( new Shape().moveTo( fLeftLegX( 0 ), 0 )
        .lineTo( fLeftLegX( height ), height )
        .lineTo( fLeftLegX( height ) + options.legWidth, height )
        .lineTo( fLeftLegX( 0 ) + options.legWidth, 0 ).close() );

      //Right leg
      this.rightLegPath.setShape( new Shape().moveTo( fRightLegX( 0 ), 0 )
        .lineTo( fRightLegX( height ), height )
        .lineTo( fRightLegX( height ) - options.legWidth, height )
        .lineTo( fRightLegX( 0 ) - options.legWidth, 0 ).close() );

      //Crossbeams
      this.crossbeam1Path.setLine( fLeftLegX( height * 0.9 ), height * 0.9, fRightLegX( height * 0.7 ), height * 0.7 );
      this.crossbeam2Path.setLine( fLeftLegX( height * 0.7 ), height * 0.7, fRightLegX( height * 0.9 ), height * 0.9 );
      this.crossbeam3Path.setLine( fLeftLegX( height * 0.5 ), height * 0.5, fRightLegX( height * 0.3 ), height * 0.3 );
      this.crossbeam4Path.setLine( fLeftLegX( height * 0.3 ), height * 0.3, fRightLegX( height * 0.5 ), height * 0.5 );
    }
  } );
} );
