import React, { useContext, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { UserContext } from '../Auth/UserProvider';

loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PreviewPageParams {
  handleSubmit:()=>void;
}

export default function PreviewPage({handleSubmit}:PreviewPageParams) {
  const {currUser}=useContext(UserContext);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }
    if (query.get('cancel')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.she ');
    }
  }, []);

  return (
    <form action={handleSubmit} method="POST" className=' w-full mx-auto'>
      <section className=' w-full mx-2 mr-2'>
        <button type="submit" role="link" className=' w-full '>
          add payment
        </button>
      </section>
      <style jsx>
        {`
          section {
            background: #ffffff;
            display: flex;
            flex-direction: column;
            width: 400px;
            height: 112px;
            border-radius: 6px;
            justify-content: space-between;
          }
          button {
            height: 36px;
            background: #556cd6;
            border-radius: 4px;
            color: white;
            border: 0;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
          }
          button:hover {
            opacity: 0.8;
          }
        `}
      </style>
    </form>
  );
}