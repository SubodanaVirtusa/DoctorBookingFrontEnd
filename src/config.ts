const defaultBaseUrl =
  process.env.NODE_ENV === 'development'
    ? '/api'
    : 'https://microservice-doctor-booking-backend-ghdae5hsekerbjba.southindia-01.azurewebsites.net';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ?? defaultBaseUrl;
