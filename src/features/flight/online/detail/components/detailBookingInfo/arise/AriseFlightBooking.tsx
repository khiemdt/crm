import { PlusOutlined } from '@ant-design/icons';
import * as React from 'react';
import { Button, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetFlightBookingPostProcessing } from '~/features/flight/flightSlice';
import AriseMoreFlight from '~/features/flight/online/detail/components/detailBookingInfo/arise/AriseMoreFlight';
import { useAppDispatch } from '~/utils/hook/redux';
import DamageIncurred from './DamageIncurred/DamageIncurred';
import VoidPostProcessings from './voidPostProcessings/VoidPostProcessings';

const { TabPane } = Tabs;

const AriseFlightBooking: React.FunctionComponent = () => {
  const [keyTab, setKeyTab] = useState({
    key: '1',
    type: '',
  });
  const onChange = (key: string) => {
    setKeyTab({
      type: '',
      key: key,
    });
  };
  const dispatch = useAppDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(fetFlightBookingPostProcessing({ bookingId: id }));
  }, []);

  return (
    <Tabs
      className='wrapper-tab-arise'
      style={{ margin: '24px 0px' }}
      defaultActiveKey={keyTab?.key}
      onChange={onChange}
      tabBarExtraContent={
        <Button
          onClick={() => {
            setKeyTab({
              ...keyTab,
              type: 'add',
            });
          }}
          icon={<PlusOutlined />}
          type='text'
          className='btn-action'
        >
          Thêm phát sinh
        </Button>
      }
    >
      <TabPane tab='Phát sinh thêm' key='1'>
        <AriseMoreFlight setKeyTab={setKeyTab} keyTab={keyTab} />
      </TabPane>
      <TabPane tab='Phát sinh hoàn huỷ' key='2'>
        <VoidPostProcessings setKeyTab={setKeyTab} keyTab={keyTab} />
      </TabPane>
      <TabPane tab='Phát sinh thiệt hại' key='3'>
        <DamageIncurred setKeyTab={setKeyTab} keyTab={keyTab} />
      </TabPane>
    </Tabs>
  );
};

export default AriseFlightBooking;
