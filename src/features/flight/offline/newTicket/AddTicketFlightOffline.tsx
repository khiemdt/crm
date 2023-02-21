import { BackTop } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { IconCaretUp } from '~/assets';
import AddTicketStep1 from './components/AddTicketStep1';
import AddTicketStep2 from './components/AddTicketStep2';
import AddTicketStep3 from './components/AddTicketStep3';

const steps = [
  {
    title: 'Thông tin cơ bản',
    content: <AddTicketStep1 />,
  },
  {
    title: 'Thông tin chi tiết',
    content: <AddTicketStep2 />,
  },
  {
    title: 'Thông tin thanh toán',
    content: <AddTicketStep3 />,
  },
];

const AddTicketFlightOffline = () => {
  const [current, setCurrent] = useState(0);
  let location = useLocation();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  useEffect(() => {
    document.title = `Tạo mới đơn offline`;
  }, []);

  useEffect(() => {
    let params = [];
    for (const entry of searchParams.entries()) {
      const [param, value] = entry;
      params.push(param);
    }
    if (params.includes('bookingId')) {
      setCurrent(2);
    } else if (params.includes('searchRequestId')) {
      setCurrent(1);
    } else {
      setCurrent(0);
    }
  }, [location]);

  return (
    <div className='flight-add-ticket-offline'>
      <div>
        <div className='step-container'>
          <div className='content'>
            {steps.map((el, idx) => (
              <div
                key={el.title}
                className={`item-step ${current === idx && 'item-step-active'} ${
                  current > idx && 'item-step-over'
                }`}
              >
                {current > idx ? (
                  <div className='num-step'>&#10003; </div>
                ) : (
                  <div className='num-step'>{idx + 1} </div>
                )}
                <span>{el.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='steps-content'>{steps[current].content}</div>
      </div>
      <BackTop>
        <div className='btn-scroll-top'>
          <IconCaretUp />
        </div>
      </BackTop>
    </div>
  );
};
export default AddTicketFlightOffline;
