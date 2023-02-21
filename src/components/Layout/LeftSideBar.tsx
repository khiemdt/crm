import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

import { FormattedMessage } from 'react-intl';
import {
  IconAirline,
  IconHotel,
  IconChevronDown,
  IconSubmenu,
  IconAdd,
  IconAirlineSelected,
  IconApproval,
  IconRevenue,
  IconRevenueDark,
  IconApprovalDark,
} from '~/assets';
import '~/components/Layout/layout.scss';
import { visiblecollaps } from '~/features/systems/systemSlice';
import { IS_COLLAPSIBLE, LAST_LINK_PREVIEW, routes } from '~/utils/constants/constant';
import { subRouteSelected } from '~/utils/constants/dataOptions';
import { isEmpty, isRestrict } from '~/utils/helpers/helpers';

const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  className?: string,
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    className,
  } as MenuItem;
}
export interface UserInfo {
  roles?: Array<string>;
  id?: number;
}

let isChangeCollapsible = false;

const LeftSideBar = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const collapsible: boolean = useAppSelector((state) => state.systemReducer.collapsible);
  const userInfo: UserInfo = useAppSelector((state) => state.systemReducer.userInfo);

  const onClick: MenuProps['onClick'] = (e) => {
    localStorage.setItem(LAST_LINK_PREVIEW, e.key);
    navigate(e.key);
  };

  function customClass(role?: string) {
    const showDefaultClass = 'show-class';
    const showHideClass = 'hide-class';
    if (!role) {
      return showDefaultClass;
    }
    if (!isRestrict(role, userInfo?.roles || [])) {
      return showHideClass;
    } else {
      return showDefaultClass;
    }
  }

  const getDefaultOpenKeys = (subKey: string) => {
    let listKey = subKey.split('/');
    listKey = listKey.slice(1, listKey.length - 1);
    let result: string[] = [];
    let parentKey = '';
    listKey.forEach((el) => {
      result.push(`${parentKey}/${el}`);
      parentKey = `${parentKey}/${el}`;
    });
    setOpenKeys(result);
  };

  const handleVisibleLeftSideBar = () => {
    isChangeCollapsible = true;
    setOpenKeys([]);
  };

  useEffect(() => {
    const selected: any = subRouteSelected.find((el) => location.pathname.includes(el.pathname));
    setSelectedKeys([selected?.pathname || location.pathname]);
  }, [location.pathname]);

  useEffect(() => {
    if (!collapsible) {
      getDefaultOpenKeys(location.pathname);
    }
  }, [collapsible]);

  useEffect(() => {
    return () => {
      isChangeCollapsible = false;
    };
  }, []);

  useEffect(() => {
    if (isEmpty(openKeys) && isChangeCollapsible) {
      isChangeCollapsible = false;
      dispatch(visiblecollaps(!collapsible));
      localStorage.setItem(IS_COLLAPSIBLE, String(!collapsible));
    }
  }, [openKeys]);

  const genGroupTitle = (title: React.ReactNode, keyGroup: string) => {
    return collapsible ? (
      <span className='group-item-collapsible'>
        <IconSubmenu />
      </span>
    ) : (
      <div className='group-item'>
        {title}
        <IconSubmenu />
      </div>
    );
  };

  const checkIconSelected = (keyGroup: string) => {
    return location.pathname.includes(keyGroup);
  };

  const items: MenuProps['items'] = [
    getItem(
      genGroupTitle(<FormattedMessage id='IDS_TEXT_SALE' />, 'sale'),
      `/${routes.SALE}`,
      null,
      [
        getItem(
          <FormattedMessage id='IDS_TEXT_FLIGHT' />,
          `/${routes.SALE}/${routes.FLIGHT}`,
          checkIconSelected(`/${routes.SALE}/${routes.FLIGHT}`) ? (
            <IconAirlineSelected />
          ) : (
            <IconAirline />
          ),
          [
            getItem(
              <a href='#'>
                <FormattedMessage id='IDS_TEXT_FLIGHT_ONLINE' />
              </a>,
              `/${routes.SALE}/${routes.FLIGHT}/${routes.FLIGHT_ONLINE}`,
              null,
            ),
            getItem(
              <a href='#'>
                <FormattedMessage id='IDS_TEXT_FLIGHT_OFFLINE' />
              </a>,
              `/${routes.SALE}/${routes.FLIGHT}/${routes.FLIGHT_OFFLINE}`,
              null,
            ),
            getItem(
              <a href='#'>
                <FormattedMessage id='IDS_TEXT_ERROR_PAGE' />
              </a>,
              `/${routes.SALE}/${routes.FLIGHT}/${routes.FLIGHT_RECONCILIATION_ERROR}`,
              null,
            ),
          ],
        ),
        // getItem(
        //   <FormattedMessage id='IDS_TEXT_HOTEL' />,
        //   `/${routes.SALE}/${routes.HOTEL}`,
        //   <IconHotel />,
        //   [
        //     getItem(
        //       <FormattedMessage id='IDS_TEXT_HOTEL_ONLINE' />,
        //       `/${routes.SALE}/${routes.HOTEL}/${routes.FLIGHT_ONLINE}`,
        //       null,
        //     ),
        //     getItem(
        //       <FormattedMessage id='IDS_TEXT_HOTEL_OFFLINE' />,
        //       `/${routes.SALE}/${routes.HOTEL}/${routes.FLIGHT_OFFLINE}`,
        //       null,
        //     ),
        //   ],
        // ),
        getItem(
          <FormattedMessage id='IDS_TEXT_APPROVAL' />,
          `/${routes.SALE}/${routes.APPROVAL}`,

          checkIconSelected(`/${routes.SALE}/${routes.APPROVAL}`) ? (
            <IconApprovalDark />
          ) : (
            <IconApproval />
          ),
          [
            getItem(
              <a href='#'>
                <FormattedMessage id='IDS_TEXT_FLIGHT_REFUND' />
              </a>,
              `/${routes.SALE}/${routes.APPROVAL}/${routes.FLIGHT}`,
              null,
            ),
            // getItem(
            //   <FormattedMessage id='IDS_TEXT_HOTEL_REFUND' />,
            //   `/${routes.SALE}/${routes.APPROVAL}/${routes.HOTEL}`,
            //   null,
            // ),
          ],
        ),
        getItem(
          <FormattedMessage id='IDS_TEXT_PAYMENT_SUPPORT' />,
          `/${routes.SALE}/${routes.PAYMENT_SUPPORT}`,
          checkIconSelected(`/${routes.SALE}/${routes.PAYMENT_SUPPORT}`) ? (
            <IconRevenue />
          ) : (
            <IconRevenueDark />
          ),
          [
            getItem(
              <a href='#'>
                <FormattedMessage id='IDS_TEXT_TRANSFER' />
              </a>,
              `/${routes.SALE}/${routes.PAYMENT_SUPPORT}/${routes.BANK_TRANSFER}`,
              null,
            ),
            getItem(
              <FormattedMessage id='IDS_TEXT_CREDIT_HOLD' />,
              `/${routes.SALE}/${routes.PAYMENT_SUPPORT}/${routes.CREDIT_TRANSFER}`,
            ),
          ],
        ),
      ],
      '',
      'group',
    ),
    // getItem(
    //   genGroupTitle(<FormattedMessage id='IDS_TEXT_MARKETING' />, 'marketing'),
    //   `/${routes.MARKETING}`,
    //   null,
    //   [
    //     getItem(
    //       <FormattedMessage id='IDS_TEXT_MARKETING_BREAKING_NEWS' />,
    //       `/${routes.MARKETING}/${routes.MARKETING_BREAKING_NEWS}`,
    //       <IconAirline />,
    //     ),
    //     getItem(
    //       <FormattedMessage id='IDS_TEXT_MARKETING_PROMOTION_CODE' />,
    //       `/${routes.MARKETING}/${routes.MARKETING_PROMOTION_CODE}`,
    //       <IconHotel />,
    //     ),
    //   ],
    //   '',
    //   'group',
    // ),
    // getItem(
    //   genGroupTitle(<FormattedMessage id='IDS_TEXT_OTHER' />, 'other'),
    //   `/${routes.OTHER}`,
    //   null,
    //   [
    //     getItem(
    //       <FormattedMessage id='IDS_TEXT_OTHER_SALE_MANAGER' />,
    //       `/${routes.OTHER}/${routes.OTHER_SALE_MANAGER}`,
    //       <IconAirline />,
    //     ),
    //   ],
    //   '',
    //   'group',
    // ),
  ];

  return (
    <Sider
      className='sider-container'
      width={240}
      collapsedWidth={56}
      collapsed={collapsible}
      collapsible
      onCollapse={handleVisibleLeftSideBar}
    >
      <Menu
        onClick={onClick}
        mode='inline'
        items={items}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={(keys) => {
          setOpenKeys(keys);
        }}
        expandIcon={(props) => {
          return (
            <IconChevronDown className={`expand-icon ${props.isOpen ? 'expand-icon-open' : ''}`} />
          );
        }}
      />
    </Sider>
  );
};

export default LeftSideBar;
