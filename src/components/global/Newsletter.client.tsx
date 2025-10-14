import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import MailchimpSubscribe from 'react-mailchimp-subscribe';
import {getCookie, setCookie} from '../../utils/cookies';
import CloseIcon from '../icons/Close';
const url = `https://intoarchive.us10.list-manage.com/subscribe/post?u=9bd39516fc90953444187ec01&amp;id=28f3b05610&amp;f_id=0053c8e5f0`;

const blackList = ['/locations/newyork'];

const CustomForm = ({status, message, onValidated}: any) => {
  const [email, setEmail] = useState('');
  const [show, setShow] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    email.indexOf('@') > -1 &&
      onValidated({
        EMAIL: email,
      });
  };

  useEffect(() => {
    if (status === 'success') {
      clearFields();
      setCookie('newsletter', 'hidden');
      setTimeout(() => {
        setShow(false);
      }, 2000);
    }
  }, [status]);

  useEffect(() => {
    const pathname = window.location.pathname;
    if (getCookie('newsletter') !== 'hidden' && !blackList.includes(pathname)) {
      setTimeout(() => {
        setShow(true);
      }, 4000);
    }
  }, []);

  const clearFields = () => {
    setEmail('');
  };

  const onClose = () => {
    setCookie('newsletter', 'hidden');
    setShow(false);
  };

  return (
    <div
      id="cta"
      className={clsx(
        'fixed bottom-0 right-0  z-40 transition-all duration-500',
        show ? 'cta-translate-hide' : 'cta-translate-show',
      )}
    >
      <div className="m-3 mr-5">
        <div
          className={clsx(
            'relative w-full rounded-md bg-theme p-6 pr-9 text-white',
          )}
        >
          {status !== 'success' && (
            <button className="absolute right-0 top-0 p-3" onClick={onClose}>
              <CloseIcon fill="white" />
            </button>
          )}
          <form
            className={clsx('relative  w-full  text-white')}
            onSubmit={(e) => handleSubmit(e)}
          >
            <h3 className="w-[220px] text-md">
              WE JUST OPENED OUR SHOWROOM IN NEW YORK CITY!
            </h3>
            {status === 'error' && (
              <div
                className="my-2"
                dangerouslySetInnerHTML={{__html: message}}
              />
            )}
            {/* {status === 'success' && (
        <div
          className="mc__alert mc__alert--success"
          dangerouslySetInnerHTML={{__html: message}}
        />
      )} */}

            {status !== 'success' ? (
              <div className="mt-4 flex flex-col gap-3 md:flex-row">
                {/* <div className="flex-1">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    value={email}
                    className="h-full w-full rounded-sm border border-b border-white border-opacity-20 bg-transparent p-2 text-white transition-all placeholder:text-white hover:border-opacity-100 focus:border-opacity-100 focus:outline-none"
                    placeholder="your@email.com"
                    required
                    autoFocus
                  />
                </div> */}

                {/*Close button appears if form was successfully sent*/}
                {/* 
                {status !== 'sending' ? (
                  <button
                    type="submit"
                    className="btn-primary w-full"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    BOOK NOW
                  </button>
                ) : (
                  <button type="submit" className="btn-secondary" disabled>
                    Sending
                  </button>
                )} */}
                <a
                  className="btn-primary w-full"
                  href={'/locations/newyork'}
                  rel="noopener noreferrer"
                  target="_blank"
                  onClick={onClose}
                >
                  BOOK NOW
                </a>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
};

const MailchimpForm = () => {
  return (
    <div className="mc__form-container">
      <MailchimpSubscribe
        url={url}
        render={({subscribe, status, message}) => (
          <CustomForm
            status={status}
            message={message}
            onValidated={(formData) => subscribe(formData)}
          />
        )}
      />
    </div>
  );
};

export default function Newsletter() {
  return <MailchimpForm />;
}
