// Copyright 2013-2022, University of Colorado Boulder

/**
 * View for the background node containing sky and ground with an option to turn off the atmosphere
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import GroundNode from '../../../../scenery-phet/js/GroundNode.js';
import SkyNode from '../../../../scenery-phet/js/SkyNode.js';
import { Node, Rectangle } from '../../../../scenery/js/imports.js';
import fluidPressureAndFlow from '../../fluidPressureAndFlow.js';

class BackgroundNode extends Node {

  /**
   * @param {UnderPressureModel} underPressureModel of the sim
   * @param {ModelViewTransform2} modelViewTransform for transforming between model and view co-ordinates
   */
  constructor( underPressureModel, modelViewTransform ) {
    super();

    // empirically determined
    const backgroundStartX = -2000;
    const backgroundWidth = 5000;
    const skyExtension = 5000;
    const groundExtension = 5000;
    const groundY = modelViewTransform.modelToViewY( 0 );

    // This is a workaround, see https://github.com/phetsims/fluid-pressure-and-flow/issues/87
    // add rectangle on top of the sky node to extend sky upwards.
    this.addChild( new Rectangle( backgroundStartX, -skyExtension, backgroundWidth, skyExtension,
      { stroke: '#01ACE4', fill: '#01ACE4' } ) );

    const skyNode = new SkyNode( backgroundStartX, 0, backgroundWidth, groundY, groundY );
    const skyNodeWithNoAtmosphere = new Rectangle(
      backgroundStartX,
      -skyExtension,
      backgroundWidth,
      ( skyExtension + groundY ),
      { fill: 'black' }
    );

    this.addChild( skyNode );
    this.addChild( skyNodeWithNoAtmosphere );

    underPressureModel.isAtmosphereProperty.link( isAtmosphere => {
      skyNode.visible = isAtmosphere;
      skyNodeWithNoAtmosphere.visible = !isAtmosphere;
    } );

    //Ground node
    this.addChild( new GroundNode( backgroundStartX, groundY, backgroundWidth, groundY + groundExtension, 295,
      { topColor: '#93774C', bottomColor: '#93774C' } ) );
  }
}

fluidPressureAndFlow.register( 'BackgroundNode', BackgroundNode );
export default BackgroundNode;