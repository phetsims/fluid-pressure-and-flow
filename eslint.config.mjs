// Copyright 2024, University of Colorado Boulder

/**
 * ESLint configuration for fluid-pressure-and-flow.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import simEslintConfig from '../chipper/eslint/sim.eslint.config.mjs';

export default [
  ...simEslintConfig,
  {
    languageOptions: {
      globals: {
        numeric: 'readonly'
      }
    }
  }
];