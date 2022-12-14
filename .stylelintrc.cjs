const {availableColors} = require('@webui/global-variables');

module.exports = {
  'extends': ['stylelint-config-standard', 'stylelint-config-prettier'],
  'plugins': ['stylelint-declaration-strict-value'],
  'rules': {
    'at-rule-no-unknown': null,
    'color-hex-length': 'long',
    'comment-empty-line-before': 'never',
    'scale-unlimited/declaration-strict-value': [
      ['/color$/'],
      {
        'ignoreValues': [
          'currentColor',
          'inherit',
          'transparent',
          'unset',
          'none',
          ...availableColors
        ],
        'expandShorthand': true,
        'message': 'Incorrect value "${value}" in property "${property}". Look at availableColors.js.'
      }
    ]
  }
};
