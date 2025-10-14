import Calendar from '../../components/calendar/Calendar.client';
import LandingSlideshow from '../../components/elements/LandingSlideshow.client';
import Layout from '../../components/global/Layout.server';
import {Image} from '@shopify/hydrogen';

const imagesMap = [
  {
    url: 'https://cdn.shopify.com/s/files/1/0592/8750/3020/files/into_10-min.jpg?v=1732202601',
    name: 'Isabel Timmerman',
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0592/8750/3020/files/into_11-min.jpg?v=1732202601',
    name: 'Brittany Noon',
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0592/8750/3020/files/into_7-min.jpg?v=1732202601',
    name: 'Harisson Yu',
  },
  // {
  //   url: 'https://cdn.shopify.com/s/files/1/0592/8750/3020/files/into_1-min.jpg?v=1732202601',
  //   name: 'Isabel Timmerman',
  // },
  // {
  //   url: 'https://cdn.shopify.com/s/files/1/0592/8750/3020/files/into_8-min.jpg?v=1732202601',
  //   name: 'Isabel Timmerman',
  // },
  // {
  //   url: 'https://cdn.shopify.com/s/files/1/0592/8750/3020/files/into_9-min.jpg?v=1732202601',
  //   name: 'Isabel Timmerman',
  // },
  {
    url: 'https://cdn.shopify.com/s/files/1/0592/8750/3020/files/into_12-min.jpg?v=1732202601',
    name: 'Darianka Sanchez',
  },
  // {
  //   url: 'https://cdn.shopify.com/s/files/1/0592/8750/3020/files/into_13-min.jpg?v=1732202601',
  //   name: 'Yeva Tamara',
  // },
  // {
  //   url: 'https://cdn.shopify.com/s/files/1/0592/8750/3020/files/into_4-min.jpg?v=1732202601',
  //   name: 'Fjolla Arifi',
  // },
  // {
  //   url: 'https://cdn.shopify.com/s/files/1/0592/8750/3020/files/into_5-min.jpg?v=1732202601',
  //   name: 'Eva Gutowski',
  // },
  // {
  //   url: 'https://cdn.shopify.com/s/files/1/0592/8750/3020/files/into_6-min.jpg?v=1732202601',
  //   name: 'Hugo Dacquet',
  // },
  // {
  //   url: 'https://cdn.shopify.com/s/files/1/0592/8750/3020/files/into_3-min.jpg?v=1732202602',
  //   name: 'Fjolla Arifi',
  // },
  // {
  //   url: 'https://cdn.shopify.com/s/files/1/0592/8750/3020/files/into_2-min.jpg?v=1732202601',
  //   name: 'Mai Pham',
  // },
];

export default function NewYorkShowroom() {
  return (
    <Layout>
      <div className="mt-8 flex flex-col justify-between gap-10 md:flex-row ">
        <div className="flex-1">
          <div className="text-[22px] " style={{fontWeight: 300}}>
            Hi New York, our showroom is now open!
          </div>
        </div>

        <div
          className="mt-2 flex-1 text-[22px] normal-case"
          style={{fontWeight: 300}}
        >
          We're INTO you New York. Discover our atelier experience to our latest
          arrivals, special pieces tailored to you as a client. Book your
          appointment below.
        </div>
      </div>

      <Calendar />

      <div className="mt-14 flex w-full justify-center align-middle">
        <LandingSlideshow
          landingPage={true}
          items={imagesMap.map((image) => (
            <div className="w-full">
              <Image
                width={400}
                height={400}
                className="w-full"
                src={image.url}
                alt={image.name}
              />
              <div className="mt-3">{image.name}</div>
            </div>
          ))}
        />
      </div>
      <div className="mt-8 flex flex-col md:flex-row md:gap-25">
        <div className="mt-3 flex flex-col">
          <div className="text-[22px]" style={{fontWeight: 400}}>
            LOCATION
          </div>
          <div
            className="mt-1 text-[21px] normal-case"
            style={{fontWeight: 300}}
          >
            37 W 26th Street NY NYC 10010
          </div>
          <div className="text-[21px]" style={{fontWeight: 300}}>
            +1 646 899 3721
          </div>
        </div>
        <div className="flex flex-col">
          <div className=" mt-6 text-[22px] md:mt-3" style={{fontWeight: 400}}>
            SHOWROOM HOURS
          </div>
          <div className="mt-2 flex w-[450px] w-full justify-start gap-5 md:justify-between md:gap-25">
            <div
              className="w-[120px] text-[21px] normal-case"
              style={{fontWeight: 300}}
            >
              Monday
            </div>
            <div className="text-[21px]" style={{fontWeight: 300}}>
              9:00 AM - 5:00 PM
            </div>
          </div>
          <div className="mt-1 flex w-[450px] w-full justify-start gap-5 md:justify-between md:gap-25">
            <div
              className="w-[120px] text-[21px] normal-case"
              style={{fontWeight: 300}}
            >
              Tuesday
            </div>
            <div className="text-[21px]" style={{fontWeight: 300}}>
              9:00 AM - 5:00 PM
            </div>
          </div>
          <div className="mt-1 flex w-[450px] w-full justify-start gap-5 md:justify-between md:gap-25">
            <div
              className="w-[120px] text-[21px] normal-case"
              style={{fontWeight: 300}}
            >
              Wednesday
            </div>
            <div className="text-[21px]" style={{fontWeight: 300}}>
              9:00 AM - 5:00 PM
            </div>
          </div>
          <div className="mt-1 flex w-[450px] w-full justify-start gap-5 md:justify-between md:gap-25">
            <div
              className="w-[120px] text-[21px] normal-case"
              style={{fontWeight: 300}}
            >
              Thursday
            </div>
            <div className="text-[21px]" style={{fontWeight: 300}}>
              9:00 AM - 5:00 PM
            </div>
          </div>
          <div className="mt-1 flex w-[450px] w-full justify-start gap-5 md:justify-between md:gap-25">
            <div
              className="w-[120px] text-[21px] normal-case"
              style={{fontWeight: 300}}
            >
              Friday
            </div>
            <div className="text-[21px]" style={{fontWeight: 300}}>
              9:00 AM - 5:00 PM
            </div>
          </div>
          <div className="mt-1 flex w-[450px] w-full justify-start gap-5 md:justify-between md:gap-25">
            <div
              className="w-[120px] text-[21px] normal-case"
              style={{fontWeight: 300}}
            >
              Saturday
            </div>
            <div className="text-[21px]" style={{fontWeight: 300}}>
              9:00 AM - 5:00 PM
            </div>
          </div>
          <div className="mt-1 flex w-[450px] w-full justify-start gap-5 md:justify-between md:gap-25">
            <div
              className="w-[120px] text-[21px] normal-case"
              style={{fontWeight: 300}}
            >
              Sunday
            </div>
            <div className="text-[21px]" style={{fontWeight: 300}}>
              9:00 AM - 5:00 PM
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
