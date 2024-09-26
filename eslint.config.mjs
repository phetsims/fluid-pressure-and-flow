// Copyright 2024, University of Colorado Boulder

/**
 * ESlint configuration for fluid-pressure-and-flow.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import parent from '../chipper/eslint/sim.eslint.config.mjs';

export default [
  ...parent,
  {
    languageOptions: {
      globals: {
        numeric: 'readonly'
      }
    }
  }
];