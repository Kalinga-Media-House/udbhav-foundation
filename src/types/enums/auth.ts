/**
 * Role enumeration for authentication and authorization.
 */
export enum RoleEnum {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  STAFF = 'Staff',
  COORDINATOR = 'Coordinator',
  VOLUNTEER = 'Volunteer',
  DONOR = 'Donor',
  MEMBER = 'Member',
  GUEST = 'Guest',
  PUBLIC = 'Public',
}

/**
 * Core permission keys for access control across modules.
 */
export enum PermissionEnum {
  PROGRAMS_READ = 'programs.read',
  PROGRAMS_CREATE = 'programs.create',
  PROGRAMS_UPDATE = 'programs.update',
  PROGRAMS_DELETE = 'programs.delete',
  EVENTS_READ = 'events.read',
  EVENTS_MANAGE = 'events.manage',
  VOLUNTEERS_READ = 'volunteers.read',
  VOLUNTEERS_MANAGE = 'volunteers.manage',
  NEWS_READ = 'news.read',
  NEWS_MANAGE = 'news.manage',
  GALLERY_READ = 'gallery.read',
  GALLERY_MANAGE = 'gallery.manage',
  DONATIONS_READ = 'donations.read',
  DONATIONS_MANAGE = 'donations.manage',
  CONTACTS_READ = 'contacts.read',
  CONTACTS_ASSIGN = 'contacts.assign',
  CONTACTS_RESOLVE = 'contacts.resolve',
  REPORTS_READ = 'reports.read',
  DASHBOARD_READ = 'dashboard.read',
  SETTINGS_MANAGE = 'settings.manage',
}
