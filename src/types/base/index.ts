/**
 * Base entity interfaces and value objects export module.
 */
export {
  type EntityId,
  type Timestamped,
  type SoftDelete,
  type Auditable,
  type Versioned,
  type Publishable,
  type CreatedBy,
  type UpdatedBy,
  type Owner,
} from './entity';

export {
  type Address,
  type GeoLocation,
  type ContactInfo,
  type SocialLinks,
  type SEO,
  type Slug,
  type Metadata,
  type Visibility,
  type Status,
  type MediaReference,
} from './value-objects';
