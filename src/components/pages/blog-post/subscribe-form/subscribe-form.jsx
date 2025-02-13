'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useCookie from 'react-use/lib/useCookie';
import useLocation from 'react-use/lib/useLocation';

import LinesIllustration from 'components/shared/lines-illustration';
import { HUBSPOT_NEWSLETTERS_FORM_ID } from 'constants/forms';
import useLocalStorage from 'hooks/use-local-storage';
import CheckIcon from 'icons/subscription-form-check.inline.svg';
import { doNowOrAfterSomeTime, emailRegexp, sendHubspotFormData } from 'utils/forms';

import SendIcon from './images/send.inline.svg';

const STATES = {
  DEFAULT: 'default',
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
};

const appearAndExitAnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const SubscribeForm = ({ className = null, size = 'lg' }) => {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState(STATES.DEFAULT);
  const [submittedEmail, setSubmittedEmail] = useLocalStorage('submittedEmailNewsletterForm', []);
  const [errorMessage, setErrorMessage] = useState('');
  const [hubspotutk] = useCookie('hubspotutk');
  const { href } = useLocation();
  const handleInputChange = (event) => {
    setEmail(event.currentTarget.value.trim());
    setFormState(STATES.DEFAULT);
    setErrorMessage('');
  };

  const context = {
    hutk: hubspotutk,
    pageUri: href,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email');
      setFormState(STATES.ERROR);
    } else if (!emailRegexp.test(email)) {
      setErrorMessage('Please enter a valid email');
      setFormState(STATES.ERROR);
    } else if (submittedEmail.includes(email)) {
      setErrorMessage('You have already submitted this email');
      setFormState(STATES.ERROR);
    } else {
      setSubmittedEmail([...submittedEmail, email]);
      setErrorMessage('');
      setFormState(STATES.LOADING);

      const loadingAnimationStartedTime = Date.now();

      try {
        const response = await sendHubspotFormData({
          formId: HUBSPOT_NEWSLETTERS_FORM_ID,
          context,
          values: [
            {
              name: 'email',
              value: email,
            },
          ],
        });

        if (response.ok) {
          doNowOrAfterSomeTime(() => {
            setFormState(STATES.SUCCESS);
            setEmail('Thank you for subscribing!');
          }, loadingAnimationStartedTime);
        } else {
          doNowOrAfterSomeTime(() => {
            setFormState(STATES.ERROR);
            setErrorMessage('Something went wrong. Please reload the page and try again');
          }, loadingAnimationStartedTime);
        }
      } catch (error) {
        doNowOrAfterSomeTime(() => {
          setFormState(STATES.ERROR);
          setErrorMessage('Something went wrong. Please reload the page and try again');
        }, loadingAnimationStartedTime);
      }
    }
  };

  return (
    <section
      className={clsx(
        'subscribe-form safe-paddings overflow-hidden',

        {
          'pb-[125px] pt-[118px] xl:pb-[123px] xl:pt-[104px] lg:pb-28 lg:pt-20 md:pb-24 md:pt-16':
            size === 'lg',
          'mt:pt-7 -mx-10 rounded-xl bg-black-new p-[70px] pr-28 2xl:mx-0 2xl:px-10 xl:py-14 lt:px-11 lg:pb-16 md:px-5 md:pb-12 md:pt-7':
            size === 'md',
        },
        className
      )}
    >
      <div
        className={clsx('mx-auto flex max-w-[1166px] items-center justify-between lg:flex-col', {
          'pr-12 2xl:px-10 2xl:pr-0 lg:px-8 md:px-4': size === 'lg',
        })}
      >
        <div className="relative z-20 lg:text-center">
          <h2 className="text-4xl leading-none tracking-tighter xl:text-[32px] sm:text-[28px]">
            Subscribe to <mark className="bg-transparent text-green-45">Neon’s News</mark>
          </h2>
          <p className="mt-4 text-lg leading-none tracking-[-0.02em] text-gray-new-80 xl:mt-2 xl:text-base xl:leading-tight sm:mx-auto sm:mt-2.5 sm:max-w-[300px]">
            Get insider access to Neon's latest news and events
          </p>
        </div>
        <form
          className={clsx('relative w-full max-w-[518px] lg:mt-5 md:mt-7', {
            'xl:max-w-[456px]': size === 'lg',
            '2xl:max-w-[400px] xl:max-w-[350px] lt:mt-0 lt:max-w-[416px] lg:max-w-[464px] sm:mt-6':
              size === 'md',
          })}
          method="POST"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="relative z-20">
            <input
              className={clsx(
                'remove-autocomplete-styles h-14 w-full appearance-none rounded-[50px] border bg-black-new pl-7 pr-36 text-white placeholder:text-white/60 focus:outline-none md:pr-32 xs:pr-7',
                formState === STATES.ERROR ? 'border-secondary-1' : 'border-green-45',
                formState === STATES.SUCCESS ? 'text-green-45' : 'text-white'
              )}
              type="email"
              name="email"
              value={email}
              placeholder="Your email address..."
              disabled={formState === STATES.LOADING || formState === STATES.SUCCESS}
              onChange={handleInputChange}
            />
            <LazyMotion features={domAnimation}>
              <AnimatePresence>
                {(formState === STATES.DEFAULT || formState === STATES.ERROR) && (
                  <m.button
                    className={clsx(
                      'absolute inset-y-2 right-2 h-10 rounded-[80px] px-7 py-3 font-bold leading-none text-black transition-colors duration-200 sm:px-5 sm:py-3 xs:flex xs:h-10 xs:w-10 xs:items-center xs:justify-center xs:px-0',
                      formState === STATES.ERROR
                        ? 'bg-secondary-1/50'
                        : 'bg-green-45 hover:bg-[#00FFAA]'
                    )}
                    type="submit"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    aria-label="Subscribe"
                    variants={appearAndExitAnimationVariants}
                  >
                    <span className="xs:hidden">Subscribe</span>
                    <SendIcon className="hidden h-6 w-6 xs:block" />
                  </m.button>
                )}
                {formState === STATES.LOADING && (
                  <m.div
                    className={clsx(
                      'absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-green-45'
                    )}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={appearAndExitAnimationVariants}
                    aria-hidden
                  >
                    <svg
                      className="absolute left-1/2 top-1/2 h-[22px] w-[22px]"
                      width="58"
                      height="58"
                      viewBox="0 0 58 58"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ transform: 'scale(1, -1) rotate(-90deg) translate(-50%, -50%)' }}
                    >
                      <m.path
                        d="M3 29C3 43.3594 14.6406 55 29 55C43.3594 55 55 43.3594 55 29C55 14.6406 43.3594 3 29 3C14.6406 3 3 14.6406 3 29Z"
                        strokeLinecap="round"
                        stroke="#0c0d0d"
                        strokeWidth="6"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1, transition: { duration: 2, delay: 0.2 } }}
                      />
                    </svg>
                  </m.div>
                )}
                {formState === STATES.SUCCESS && (
                  <m.div
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-green-45 text-black"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={appearAndExitAnimationVariants}
                  >
                    <CheckIcon className="h-10 w-10" />
                  </m.div>
                )}
              </AnimatePresence>
            </LazyMotion>

            {formState === STATES.ERROR && errorMessage && (
              <span className="absolute left-7 top-full mt-2.5 text-sm leading-none tracking-[-0.02em] text-secondary-1 sm:text-xs sm:leading-tight">
                {errorMessage}
              </span>
            )}
          </div>
          <LinesIllustration
            className="z-10 !w-[125%]"
            spread={4}
            color={formState === STATES.ERROR ? '#FF4C79' : '#00E599'}
            size="sm"
          />
        </form>
      </div>
    </section>
  );
};

SubscribeForm.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['lg', 'md']),
};

export default SubscribeForm;
