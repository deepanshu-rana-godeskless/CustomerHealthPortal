// This file mimics Angular's environment.ts pattern for environment switching
// Only one export should be uncommented at a time

// DEV
// export const environment = {
//     production: false,
//     apiUrl: 'https://stbbackend-dev.godeskless.com',
//     leadCreationApiUrl: 'https://multitenancydev.godeskless.com'
// };

// QA
// export const environment = {
//   production: false,
//   apiUrl: 'https://stbbackend-qa.godeskless.com',
//   leadCreationApiUrl: 'https://stbpy3dev.godeskless.com'
// };

// Staging
export const environment = {
  production: false,
  apiUrl: 'https://stbbackend-staging.godeskless.com',
  leadCreationApiUrl: 'https://trackhelpstaging.godeskless.com'
};

// Prod
// export const environment = {
//   production: true,
//   apiUrl: 'https://stbbackend.godeskless.com',
//   leadCreationApiUrl: 'https://trackhelpprod.godeskless.com'
// };