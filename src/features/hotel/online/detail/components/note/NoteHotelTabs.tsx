import { Tabs, Typography } from 'antd';
import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { UserInfo } from '~/components/Layout/LeftSideBar';
import { some } from '~/utils/constants/constant';
import { useAppSelector } from '~/utils/hook/redux';
import NoteHotel from './NoteHotel';
import NoteHotelManipolation from './NoteHotelManipulation';

interface INoteHotelTabsProps {}

const NoteHotelTabs: React.FunctionComponent<INoteHotelTabsProps> = (props) => {
  const intl = useIntl();
  const userInfo: UserInfo = useAppSelector((state) => state.systemReducer.userInfo);
  const hotelDetail: some = useAppSelector((state) => state.hotelReducer.hotelOnlineDetail);

  return (
    <div className='note-hotel'>
      <div className='content'>
        {userInfo?.id === hotelDetail?.lastSaleId ? (
          <Tabs defaultActiveKey='1' onChange={() => {}} type='line'>
            <Tabs.TabPane tab={intl.formatMessage({ id: 'IDS_TEXT_NOTE' }).toUpperCase()} key='1'>
              <NoteHotel />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={intl.formatMessage({ id: 'IDS_TEXT_MANIPULATION' }).toUpperCase()}
              key='2'
            >
              <NoteHotelManipolation />
            </Tabs.TabPane>
          </Tabs>
        ) : (
          <div>
            <Typography.Title level={4} style={{ padding: '16px 16px 0px' }}>
              <FormattedMessage id='IDS_TEXT_NOTE' />
            </Typography.Title>
            <NoteHotel />
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteHotelTabs;
