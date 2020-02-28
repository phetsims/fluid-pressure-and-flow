// Copyright 2016-2020, University of Colorado Boulder

/**
 * The screen (model + view) for the Under Pressure screen, which appears as a standalone sim in the "Under Pressure" sim
 * as well as the 1st screen in the "Fluid Pressure and Flow" sim.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import Image from '../../../scenery/js/nodes/Image.js';
import underPressureScreenIcon from '../../images/under-pressure_png.js';
import fluidPressureAndFlowStrings from '../fluid-pressure-and-flow-strings.js';
import fluidPressureAndFlow from '../fluidPressureAndFlow.js';
import UnderPressureModel from './model/UnderPressureModel.js';
import UnderPressureScreenView from './view/UnderPressureScreenView.js';

const underPressureScreenTitleString = fluidPressureAndFlowStrings.underPressureScreenTitle;

class UnderPressureScreen extends Screen {

  constructor() {

    const options = {
      name: underPressureScreenTitleString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new Image( underPressureScreenIcon )
    };

    super(
      () => new UnderPressureModel(),
      model => new UnderPressureScreenView( model ),
      options
    );
  }
}

fluidPressureAndFlow.register( 'UnderPressureScreen', UnderPressureScreen );
export default UnderPressureScreen;