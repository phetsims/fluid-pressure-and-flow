// Copyright 2016-2022, University of Colorado Boulder

/**
 * The screen (model + view) for the Under Pressure screen, which appears as a standalone sim in the "Under Pressure" sim
 * as well as the 1st screen in the "Fluid Pressure and Flow" sim.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import underPressure_png from '../../images/underPressure_png.js';
import fluidPressureAndFlow from '../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../FluidPressureAndFlowStrings.js';
import UnderPressureModel from './model/UnderPressureModel.js';
import UnderPressureScreenView from './view/UnderPressureScreenView.js';

class UnderPressureScreen extends Screen {

  constructor() {

    const options = {
      name: FluidPressureAndFlowStrings.underPressureScreenTitleStringProperty,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new ScreenIcon( new Image( underPressure_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
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