import Container from 'components/shared/container/container';

import QuoteIcon from './images/quote.inline.svg';

const Testimonial = () => (
  <figure className="testimonial safe-paddings mt-[200px] 2xl:mt-40 xl:mt-36 lg:mt-28 md:mt-20">
    <Container className="flex flex-col items-center text-center" size="xs">
      <QuoteIcon
        className="h-[72px] w-[72px] xl:h-16 xl:w-16 md:h-12 md:w-12"
        width={72}
        height={72}
        aria-hidden
      />
      <blockquote className="mt-6 lg:mt-4 md:mt-2.5">
        <p className="max-w-[796px] text-[28px] font-light leading-snug tracking-tighter xl:max-w-[706px] xl:text-2xl lg:max-w-[584px] lg:text-xl md:text-lg">
          By partnering with Neon, Vercel’s frontend platform is now the end&#8209;to&#8209;end
          serverless solution for building on the Web, from Next.js all&nbsp;the way to SQL.
        </p>
      </blockquote>
      <figcaption className="mt-5 text-lg leading-tight tracking-[-0.02em] text-white xl:text-base lg:mt-4 md:mt-2.5">
        Guillermo Rauch{' '}
        <cite className="font-light not-italic text-gray-new-70">– CEO of Vercel</cite>
      </figcaption>
    </Container>
  </figure>
);

export default Testimonial;
