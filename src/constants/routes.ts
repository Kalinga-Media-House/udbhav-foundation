export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    ABOUT: '/about',
    PROGRAMMES: '/programmes',
    GALLERY: '/gallery',
    NEWS_AND_STORIES: '/news-and-stories',
    VOLUNTEERS: '/volunteers',
    DONATE: '/donate',
    CORE_TEAM: '/core-team',
    CONTRIBUTORS: '/contributors',
    PRIVACY_POLICY: '/privacy-policy',
    TERMS_OF_USE: '/terms-of-use',
  },
  AUTH: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/login/forgot-password',
    UPDATE_PASSWORD: '/login/update-password',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
  },
  API: {
    VOLUNTEER_APPLICATION: '/api/volunteer-application',
  }
} as const;
