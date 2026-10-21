import React from 'react';

export const LogoIcon = ({ size = 44, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="MR SM Multi Brand Store Logo"
  >
    {/* Outer circle rings with Caramel and Mocha */}
    <circle cx="50" cy="50" r="48" stroke="#C48A5A" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="44" stroke="#2B1D17" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="42" fill="#2B1D17" />
    
    {/* Crown at top */}
    <path
      d="M36 28 L40 38 L50 30 L60 38 L64 28 L62 42 H38 Z"
      fill="#C48A5A"
    />
    <circle cx="36" cy="27" r="2" fill="#E7D6C1" />
    <circle cx="50" cy="29" r="2.2" fill="#E7D6C1" />
    <circle cx="64" cy="27" r="2" fill="#E7D6C1" />

    {/* Shield Base */}
    <path
      d="M36 44 H64 V60 C64 70 50 78 50 78 C50 78 36 70 36 60 Z"
      fill="#3D2920"
      stroke="#C48A5A"
      strokeWidth="1.5"
    />

    {/* Monogram SM inside shield */}
    <text
      x="50"
      y="64"
      textAnchor="middle"
      fontFamily="'Plus Jakarta Sans', sans-serif"
      fontSize="17"
      fontWeight="800"
      fill="#FAF6F0"
      letterSpacing="1"
    >
      SM
    </text>
  </svg>
);

export const BagIcon = ({ size = 22, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export const SearchIcon = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const MenuIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const CloseIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const PhoneIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const WhatsAppIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.37 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.12 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.98 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.39C16.32 14.27 15.11 13.67 14.88 13.59C14.66 13.5 14.49 13.46 14.33 13.71C14.16 13.96 13.69 14.51 13.55 14.67C13.4 14.84 13.26 14.86 13.01 14.73C12.76 14.61 11.96 14.35 11.01 13.5C10.27 12.84 9.77 12.02 9.63 11.77C9.48 11.52 9.61 11.39 9.74 11.26C9.85 11.15 9.99 10.97 10.11 10.83C10.24 10.69 10.28 10.58 10.36 10.42C10.45 10.25 10.4 10.11 10.34 9.98C10.28 9.86 9.78 8.64 9.57 8.14C9.37 7.65 9.17 7.72 9.02 7.71C8.87 7.7 8.71 7.7 8.54 7.7C8.38 7.7 8.11 7.76 7.88 8.01C7.66 8.26 7.02 8.86 7.02 10.07C7.02 11.28 7.9 12.45 8.03 12.61C8.15 12.78 9.77 15.28 12.24 16.35C12.83 16.6 13.29 16.75 13.65 16.86C14.24 17.05 14.78 17.02 15.21 16.96C15.68 16.89 16.66 16.37 16.86 15.79C17.07 15.21 17.07 14.71 17.01 14.61C16.95 14.51 16.82 14.51 16.57 14.39Z" />
  </svg>
);

export const MapPinIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const ChevronRightIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const TrashIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const CheckIcon = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
