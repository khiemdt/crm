import { Tabs } from 'antd';
import * as React from 'react';
import { useState } from 'react';
import BookingRemarkAndPolicy from './BookingRemarkAndPolicy';
import TagsFlightBooking from './TagsFlightBooking';

const { TabPane } = Tabs;

const PolicyNotesTabs: React.FunctionComponent = () => {
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

  return (
    <Tabs
      className='wrapper-tab-arise'
      style={{ margin: '24px 0px' }}
      defaultActiveKey={keyTab?.key}
      onChange={onChange}
    >
      <TabPane tab='Tag' key='1'>
        <TagsFlightBooking />
      </TabPane>
      <TabPane tab='Nội dung xuất vé' key='2'>
        <BookingRemarkAndPolicy />
      </TabPane>
    </Tabs>
  );
};

export default PolicyNotesTabs;
