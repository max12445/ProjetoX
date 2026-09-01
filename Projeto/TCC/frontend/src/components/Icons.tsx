import React from "react";

export interface IconProps {
  className?: string;
}

const base = (className?: string) => className ?? "h-5 w-5";

const Svg: React.FC<IconProps & { children: React.ReactNode; filled?: boolean }> = ({
  className,
  children,
  filled,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "none" : "currentColor"}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={base(className)}
  >
    {children}
  </svg>
);

export const CartIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M6 7h13l1 4a4.5 4.5 0 0 1-4.5 4.5H7.5A3.5 3.5 0 0 1 4 12V5.5A1.5 1.5 0 0 0 2.5 4H2" />
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="17" cy="20" r="1.4" />
  </Svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="m15 5-7 7 7 7" />
  </Svg>
);

export const EyeIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
    <circle cx="12" cy="12" r="2.5" />
  </Svg>
);

export const EyeOffIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M9.9 5.2A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 3.9M6.2 6.2A16.7 16.7 0 0 0 2 12s3.5 7 10 7a10.7 10.7 0 0 0 5.8-1.8" />
    <path d="m3 3 18 18" />
  </Svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M4 6h16M9 6V4.8A1.8 1.8 0 0 1 10.8 3h2.4A1.8 1.8 0 0 1 15 4.8V6" />
    <path d="M6 6l.8 12.2A2 2 0 0 0 8.8 20h6.4a2 2 0 0 0 2-1.8L18 6" />
    <path d="M10 10v6M14 10v6" />
  </Svg>
);

export const PackageIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
    <path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" />
  </Svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M12 21s6-5.4 6-10.5A6 6 0 0 0 6 10.5C6 15.6 12 21 12 21Z" />
    <circle cx="12" cy="10.5" r="2.2" />
  </Svg>
);

export const CreditCardIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="M2.5 9.5h19" />
  </Svg>
);

export const BarcodeIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M4 5v14M8 5v14M12 5v14M16 5v14M20 5v14" />
  </Svg>
);

export const ZapIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className} filled>
    <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />
  </Svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="m4.5 12.5 5 5L19.5 7" />
  </Svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const MinusIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M5 12h14" />
  </Svg>
);

export const XIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const SpinnerIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    aria-hidden="true"
    className={base(className) }
  >
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
);

export const StoreIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M4 9.5V20h16V9.5" />
    <path d="M3 4h18l1 5.5a2.5 2.5 0 0 1-2.5 2.6 2.6 2.6 0 0 1-2.6-2.6A2.6 2.6 0 0 1 14 12a2.6 2.6 0 0 1-2.6-2.6A2.6 2.6 0 0 1 8.6 12 2.6 2.6 0 0 1 6 9.4 2.6 2.6 0 0 1 3.5 12 2.5 2.5 0 0 1 1 9.5L3 4Z" />
  </Svg>
);

export const TruckIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M1.5 4h13v12h-13V4Z" />
    <path d="M14.5 8h3.5l3.5 4v4h-7V8Z" />
    <circle cx="6" cy="19" r="1.8" />
    <circle cx="17.5" cy="19" r="1.8" />
  </Svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M12 2.5 20 6v6c0 5-3.4 8.3-8 9.5C7.4 20.3 4 17 4 12V6l8-3.5Z" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </Svg>
);

export const AlertIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V13" />
    <circle cx="12" cy="16.5" r="0.5" fill="currentColor" />
  </Svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6.5V12l3.5 2" />
  </Svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9" />
    <path d="M16 8l4 4-4 4M20 12H10" />
  </Svg>
);

export const MailIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </Svg>
);

export const LockIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </Svg>
);

export const ImageIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="m4 17 5-5 3.5 3.5L15 13l5 5" />
  </Svg>
);