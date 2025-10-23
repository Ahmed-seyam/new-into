import {useState, useEffect} from 'react';
import clsx from 'clsx';
import {getCookie, setCookie} from '~/utils/cookies';
import CloseIcon from '~/components/icons/Close';

const blackList = ['/locations/newyork'];

export default function Newsletter() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const pathname = window.location.pathname;
    if (getCookie('newsletter') !== 'hidden' && !blackList.includes(pathname)) {
      setTimeout(() => setShow(true), 4000);
    }
  }, []);

  const onClose = () => {
    setCookie('newsletter', 'hidden');
    setShow(false);
  };

  return (
    <div
      id="cta"
      className={clsx(
        'fixed bottom-0 right-0 z-40 transition-all duration-500',
        show ? 'translate-x-0' : 'translate-x-full',
      )}
    >
      <div className="m-3 mr-5">
        <div
          className={clsx(
            'relative w-full rounded-md bg-theme p-6 pr-9 text-white',
          )}
        >
          <button className="absolute right-0 top-0 p-3" onClick={onClose}>
            <CloseIcon fill="white" />
          </button>
          <div className={clsx('relative w-full text-white')}>
            <h3 className="w-[220px] text-md">
              WE JUST OPENED OUR SHOWROOM IN NEW YORK CITY!
            </h3>
            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <a
                className="btn-primary w-full"
                href="/locations/newyork"
                rel="noopener noreferrer"
                target="_blank"
                onClick={onClose}
              >
                BOOK NOW
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
