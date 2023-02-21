import { Col } from 'antd';
import BookingInfo from './BookingInfo';
import ContactInfo from './ContactInfo';
import Guests from './Guests';
import InsuranceBooking from './InsuranceBooking';
import TagsFlightBooking from '~/features/flight/online/detail/components/detailBookingInfo/tabsAndPolicyNote/TagsFlightBooking';
import AriseFlightBooking from '~/features/flight/online/detail/components/detailBookingInfo/arise/AriseFlightBooking';
import { useEffect } from 'react';
import PolicyNotesTabs from './tabsAndPolicyNote/PolicyNotesTabs';

const InfoFlight = () => {
  return (
    <div>
      <div className='info-flight'>
        <ContactInfo />
        <Col className='booking-hub'>
          <BookingInfo />
          <InsuranceBooking />
        </Col>
        <Guests />
      </div>
      <AriseFlightBooking />
      <PolicyNotesTabs />
    </div>
  );
};
export default InfoFlight;
