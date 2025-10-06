import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

//Configure Testing Library for React 18
configure({
  asyncUtilTimeout: 5000,
});
