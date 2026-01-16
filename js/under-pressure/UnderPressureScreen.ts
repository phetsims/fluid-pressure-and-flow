// Copyright 2016-2025, University of Colorado Boulder

/**
 * The screen (model + view) for the Under Pressure screen, which appears as a standalone sim in the "Under Pressure" sim
 * as well as the 1st screen in the "Fluid Pressure and Flow" sim.
 *
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Tandem from '../../../tandem/js/Tandem.js';
import underPressure_png from '../../images/underPressure_png.js';
import fluidPressureAndFlow from '../fluidPressureAndFlow.js';
import FluidPressureAndFlowStrings from '../FluidPressureAndFlowStrings.js';
import UnderPressureModel from './model/UnderPressureModel.js';
import UnderPressureScreenView from './view/UnderPressureScreenView.js';

class UnderPressureScreen extends Screen<UnderPressureModel, UnderPressureScreenView> {

  public constructor() {

    super(
      () => new UnderPressureModel(),
      model => new UnderPressureScreenView( model ), {
        tandem: Tandem.OPT_OUT,
        name: FluidPressureAndFlowStrings.underPressureScreenTitleStringProperty,
        backgroundColorProperty: new Property( 'white' ),
        homeScreenIcon: new ScreenIcon( new Image( underPressure_png ), {
          maxIconWidthProportion: 1,
          maxIconHeightProportion: 1
        } )
      }
    );
  }
}

fluidPressureAndFlow.register( 'UnderPressureScreen', UnderPressureScreen );
export default UnderPressureScreen;