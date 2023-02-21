import { Tabs, Typography } from 'antd';
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { some } from '~/utils/constants/constant';
import { useAppSelector } from '~/utils/hook/redux';
import NoteFlight from './NoteFlight';
import NoteManipulation from './NoteManipulation';

interface INoteTabsProps {}

const NoteTabs: React.FunctionComponent<INoteTabsProps> = (props) => {
  const intl = useIntl();

  const userInfo: some = useAppSelector((state) => state?.systemReducer?.userInfo);
  const { flightOnlineDetail } = useAppSelector((state: some) => state?.flightReducer);
  const collapsible: boolean = useAppSelector((state) => state.systemReducer.collapsible);

  return (
    <div className='note-flight' style={{ width: collapsible ? 550 : 340 }}>
      <div className='content'>
        {flightOnlineDetail?.lastSaleId === userInfo?.id &&
        flightOnlineDetail.handlingStatus == 'handling' ? (
          <Tabs
            moreIcon={null}
            className='tabs-note'
            centered
            defaultActiveKey='1'
            onChange={() => {}}
            type='line'
          >
            <Tabs.TabPane tab={intl.formatMessage({ id: 'IDS_TEXT_NOTE' }).toUpperCase()} key='1'>
              <NoteFlight />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={intl.formatMessage({ id: 'IDS_TEXT_MANIPULATION' }).toUpperCase()}
              key='2'
            >
              <NoteManipulation />
            </Tabs.TabPane>
          </Tabs>
        ) : (
          <>
            <Typography.Title level={4} style={{ padding: '16px 16px 0px' }}>
              <FormattedMessage id='IDS_TEXT_NOTE' />
            </Typography.Title>
            <NoteFlight />
          </>
        )}
      </div>
    </div>
  );
};

export default NoteTabs;
