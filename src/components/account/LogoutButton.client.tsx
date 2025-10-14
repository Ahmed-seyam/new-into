import { ButtonHTMLAttributes, useCallback } from 'react';

import Button from '../elements/Button';

type Props = {
  onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function LogoutButton({onClick, ...rest}: Props) {
  const handleLogout = useCallback(() => {
    fetch('/api/account/logout', {method: 'POST'}).then(() => {
      if (typeof onClick === 'function') {
        onClick();
      }
      window.location.href = '/';
    });
  }, [onClick]);

  return (
    <button className="btn-primary" onClick={handleLogout} {...rest}>
      Log out
    </button>
  );
}
