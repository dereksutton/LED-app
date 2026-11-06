"use client";
import { smsHref } from '../data/site';
import { getRefCode } from '../lib/attribution';

// An sms: link to the 904 number with the message prefilled. The page is
// built ahead of time, so the visitor's ref code goes in as it's tapped,
// before the messages app opens.
export default function TextUsLink({ children, onClick, ...props }) {
  const addRef = (e) => {
    e.currentTarget.setAttribute('href', smsHref(getRefCode()));
    if (onClick) onClick(e);
  };
  return <a href={smsHref('')} onClick={addRef} {...props}>{children}</a>;
}
