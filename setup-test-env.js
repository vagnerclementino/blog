require('@testing-library/jest-dom');
const { configure } = require('@testing-library/react');

//Configure Testing Library for React 18
configure({
  asyncUtilTimeout: 5000,
});
