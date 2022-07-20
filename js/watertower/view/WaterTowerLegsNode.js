// Copyright 2014-2022, University of Colorado Boulder

/**
 * WaterTowerLegsNode
 * @author Siddhartha Chinthapally (Actual Concepts) on 6/24/2014.
 */

import Utils from '../../../../dot/js/Utils.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import { Line, Node, Path } from '../../../../scenery/js/imports.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class WaterTowerLegsNode extends Node {
  /**
   * @param {number} width between the right and left legs at the bottom
   * @param {Property.<Vector2>} tankPositionProperty which can be observed to change the height of the legs. tankPosition.y forms the top bound of the waterTowerLegs w.r.t to the modelViewTransform used.
   * @param {ModelViewTransform2} modelViewTransform to convert between view and model values
   * @param {Object} [options]
   */
  constructor( width, tankPositionProperty, modelViewTransform, options ) {

    super();

    options = merge( {
      legWidth: 10,
      crossbeamWidth: 4
    }, options );
    this.options = options; // @private

    const legPaintOptions = { stroke: 'black', lineWidth: 1, fill: 'black' };
    const crossbeamPaintOptions = { stroke: 'black', lineWidth: this.options.crossbeamWidth };

    this.waterTowerWidth = width;
    this.waterTowerHeight = 0;  // will be set to correct value by tankPositionProperty observer below

    this.leftLegPath = new Path( null, legPaintOptions );
    this.rightLegPath = new Path( null, legPaintOptions );
    this.crossbeam1Path = new Line( 0, 0, 0, 0, crossbeamPaintOptions );
    this.crossbeam2Path = new Line( 0, 0, 0, 0, crossbeamPaintOptions );
    this.crossbeam3Path = new Line( 0, 0, 0, 0, crossbeamPaintOptions );
    this.crossbeam4Path = new Line( 0, 0, 0, 0, crossbeamPaintOptions );
    this.children = [ this.leftLegPath, this.rightLegPath, this.crossbeam1Path, this.crossbeam2Path, this.crossbeam3Path, this.crossbeam4Path ];

    tankPositionProperty.link( tankPosition => {
      // update the legs
      this.waterTowerHeight = -modelViewTransform.modelToViewDeltaY( tankPosition.y );
      this.updateShape();
    } );

    this.mutate( this.options );
  }

  /**
   * Update the shape of the water tower legs when the water tower has been raised or lowered.
   * @private
   */
  updateShape() {

    const width = this.waterTowerWidth;
    const height = this.waterTowerHeight;
    const leftLegTopX = width * 0.2;
    const rightLegTopX = width * 0.8;
    const options = this.options;

    // use 1 instead of 0 when the height is 0. This is to prevent divide by zero and other problems.
    const fLeftLegX = y => Utils.linear( 0, height > 0 ? height : 1, leftLegTopX, 0, y );

    const fRightLegX = y => Utils.linear( 0, height > 0 ? height : 1, rightLegTopX, width, y );

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
}

fluidPressureAndFlow.register( 'WaterTowerLegsNode', WaterTowerLegsNode );
export default WaterTowerLegsNode;