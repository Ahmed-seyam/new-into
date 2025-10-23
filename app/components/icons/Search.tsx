import { HTMLAttributes } from 'react';

export default function SearchIcon(props: HTMLAttributes<SVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.0402 14.8803C17.7616 12.1899 17.7616 7.82792 15.0402 5.13754C12.3188 2.44715 7.90658 2.44715 5.1852 5.13754C2.46382 7.82792 2.46382 12.1899 5.1852 14.8803C7.90658 17.5707 12.3188 17.5707 15.0402 14.8803ZM16.5563 16.3792C20.1151 12.861 20.1151 7.15685 16.5563 3.63865C12.9976 0.12045 7.22778 0.12045 3.66905 3.63865C0.110318 7.15685 0.110318 12.861 3.66905 16.3792C7.22778 19.8974 12.9976 19.8974 16.5563 16.3792Z"
        fill="black"
      />
      <path
        d="M15.4192 16.0045L16.9354 14.5056L23 20.5011L21.4838 22L15.4192 16.0045Z"
        fill="black"
      />
    </svg>
  );
}
