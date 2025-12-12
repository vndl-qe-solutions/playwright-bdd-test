import dotenv from 'dotenv';

dotenv.config();

// Cucumber.js v10+ configuration
// See: https://github.com/cucumber/cucumber-js/blob/main/docs/cli.md

export default {
  default: {
    paths: 'features/**/*.{feature,feature.md}',
    require: [
      'hooks/world.js',
      'hooks/hooks.js',
      'step_definitions/*.js',
    ],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
    ],
    formatOptions: {
      snippetInterface: 'async-await',
    },
  },
  smoke: {
    require: [
      'hooks/world.js',
      'hooks/hooks.js',
      'step_definitions/*.js',
    ],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
    ],
    tags: '@smoke',
  },
  regression: {
    require: [
      'hooks/world.js',
      'hooks/hooks.js',
      'step_definitions/*.js',
    ],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
    ],
    tags: '@regression',
  },
  ci: {
    require: [
      'hooks/world.js',
      'hooks/hooks.js',
      'step_definitions/*.js',
    ],
    format: [
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
    ],
    parallel: 1,
  },
};
