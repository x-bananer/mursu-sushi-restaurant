type IconProps = {
  className?: string;
};

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M10 38L30 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18 38L38 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ComboIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <rect
        x="6"
        y="22"
        width="36"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect x="10" y="18" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="20" y="18" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="30" y="18" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
      <path
        d="M32 10L42 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M28 10L38 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M6 20L24 6L42 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 20V38H20V28H28V38H38V20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="18" r="5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M14 34C14 29 18 26 24 26C30 26 34 29 34 34"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M8 12H12L16 28H34L38 16H14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="34" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="34" r="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/* Admin icons below */

export function DashboardIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect x="3"  y="3"  width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="3"  width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3"  y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function LiveOrdersIcon({ className }: IconProps) {
  return (
    <svg className={className}viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 2V4M12 20V22M2 12H4M20 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5.64 5.64L7.05 7.05M16.95 16.95L18.36 18.36M5.64 18.36L7.05 16.95M16.95 7.05L18.36 5.64" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function MenuEditorIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5"  width="18" height="2" rx="1" fill="currentColor" />
        <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" />
        <rect x="3" y="17" width="12" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function DailySpecialIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L14.4 8.8H21.6L15.8 12.9L18.2 19.7L12 15.6L5.8 19.7L8.2 12.9L2.4 8.8H9.6L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function CustomersIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 21C2 17.13 5.13 14 9 14C10.08 14 11.1 14.25 12 14.68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="18" cy="17" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 14V17L20 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
  );
}

export function ReviewsIcon({ className }: IconProps) {
  return (
     <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M21 15C21 16.1 20.1 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M19.4 15C19.2 15.3 19.2 15.7 19.4 16L20.9 18.6C21.1 19 21 19.5 20.6 19.7L18.1 21.2C17.7 21.4 17.2 21.3 17 20.9L15.5 18.3C15.2 17.9 14.8 17.8 14.4 18C13.9 18.2 13.5 18.3 13 18.3C12.6 18.3 12.1 18.2 11.6 18C11.2 17.8 10.8 17.9 10.5 18.3L9 20.9C8.8 21.3 8.3 21.4 7.9 21.2L5.4 19.7C5 19.5 4.9 19 5.1 18.6L6.6 16C6.8 15.7 6.8 15.3 6.6 15C6.3 14.5 6.2 14 6.2 13.5C6.2 13 6.3 12.5 6.6 12C6.8 11.7 6.8 11.3 6.6 11L5.1 8.4C4.9 8 5 7.5 5.4 7.3L7.9 5.8C8.3 5.6 8.8 5.7 9 6.1L10.5 8.7C10.8 9.1 11.2 9.2 11.6 9C12.1 8.8 12.5 8.7 13 8.7C13.5 8.7 13.9 8.8 14.4 9C14.8 9.2 15.2 9.1 15.5 8.7L17 6.1C17.2 5.7 17.7 5.6 18.1 5.8L20.6 7.3C21 7.5 21.1 8 20.9 8.4L19.4 11C19.2 11.3 19.2 11.7 19.4 12C19.7 12.5 19.8 13 19.8 13.5C19.8 14 19.7 14.5 19.4 15Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
