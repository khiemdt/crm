// lib
import { Layout } from 'antd';
import { FC, ReactNode, useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

// func
import {
  AirlinesType,
  AllowAgentType,
  fetAirlines,
  fetAllCountries,
  fetAllowAgents,
  fetUserInfoAsync,
  visiblecollaps,
} from '~/features/systems/systemSlice';
import { isAuthenticate, isEmpty } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

// component
import HeaderContainer from '~/components/Layout/HeaderContainer';
import LeftSideBar from '~/components/Layout/LeftSideBar';
import Loading from '~/components/loading/Loading';
import Dashboard from '~/features/example/Dashboard';
import Login from '~/features/login/login';
import { IS_COLLAPSIBLE, routes, some } from '~/utils/constants/constant';

import '~/components/Layout/layout.scss';
import Sample from '~/features/example/Sample';

import FlightOnline from '~/features/flight/online/Flight';
import FlightDetail from '~/features/flight/online/detail/FlightDetail';
import FlightOffline from '~/features/flight/offline/FilghtOffline';
import Reconciliation from '~/features/flight/reconciliation/Reconciliation';
import ErrorDetailPage from '~/features/flight/reconciliation/ErrorDetailPage';
import AddTicketFlightOffline from './features/flight/offline/newTicket/AddTicketFlightOffline';
import HotelOnline from '~/features/hotel/online/HotelOnline';
import HotelOffline from '~/features/hotel/offline/HotelOffline';
import HotelOnlineDetail from '~/features/hotel/online/detail/HotelOnlineDetail';
import FlightApproval from './features/approval/flight/FlightApproval';
import HotelApproval from './features/approval/hotel/HotelApproval';
import { fetSalesList } from './features/flight/flightSlice';
import TransferSupport from './features/payment_support/transfer/BankTransfer';
import BankTransfer from './features/payment_support/transfer/BankTransfer';
import PaymentSupportTools from './features/tools/payment_tools/PaymentSupportTools';
import PageNotFound from './components/404Page/PageNotFound';
import CreditHoldTransaction from './features/payment_support/credit_hold_transaction/CreditHoldTransaction';
import BankAccountList from './features/tools/payment_tools/components/BankAccountList';

const { Content } = Layout;

interface UserInfo {
  roles?: Array<string>;
}

const RoutesComponent: FC = () => {
  let location = useLocation();
  const dispatch = useAppDispatch();
  const userInfo: UserInfo = useAppSelector((state) => state.systemReducer.userInfo);
  const allowAgents: AllowAgentType[] = useAppSelector((state) => state.systemReducer.allowAgents);
  const airlines: AirlinesType[] = useAppSelector((state) => state.systemReducer.airlines);
  const countries: some[] = useAppSelector((state) => state.systemReducer.countries);
  const salesList: some[] = useAppSelector((state) => state.flightReducer.salesList);

  useEffect(() => {
    if (isAuthenticate()) {
      if (isEmpty(userInfo)) {
        getUserInfo();
      }
      if (isEmpty(allowAgents)) {
        dispatch(fetAllowAgents());
      }
      if (isEmpty(airlines)) {
        dispatch(fetAirlines());
      }
      if (isEmpty(countries)) {
        dispatch(fetAllCountries());
      }
      if (isEmpty(salesList)) {
        dispatch(fetSalesList());
      }
    }
  }, [location]);

  useEffect(() => {
    dispatch(visiblecollaps(localStorage.getItem(IS_COLLAPSIBLE) === 'true'));
  }, []);

  const getUserInfo = async () => {
    try {
      const originalPromiseResult = await dispatch(fetUserInfoAsync());
    } catch (rejectedValueOrSerializedError) {
      console.log('rejectedValueOrSerializedError', rejectedValueOrSerializedError);
    }
  };
  return (
    <>
      <Loading />
      <Routes>
        <Route
          path={routes.DASHBOARD}
          element={<ProtectedRoute redirectPath={routes.LOGIN} isAllowed={isAuthenticate()} />}
        >
          <Route path={routes.DASHBOARD} element={<Dashboard />} />
        </Route>
        <Route path={routes.LOGIN} element={<Login />} />

        {/* SALE */}
        <Route
          element={<ProtectedRoute redirectPath={routes.LOGIN} isAllowed={isAuthenticate()} />}
        >
          <Route path={routes.SALE}>
            {/* flight */}
            <Route path={routes.FLIGHT}>
              {/* FLIGHT_ONLINE */}
              <Route path={routes.FLIGHT_ONLINE} element={<FlightOnline />} />
              <Route path={routes.FLIGHT_ONLINE}>
                <Route path=':id' element={<FlightDetail />} />
              </Route>
              {/* FLIGHT_OFFLINE */}
              <Route path={routes.FLIGHT_OFFLINE} element={<BankAccountList />} />
              <Route path={routes.FLIGHT_OFFLINE}>
                <Route path={routes.FLIGHT_ADD_NEW_TICKET} element={<AddTicketFlightOffline />} />
              </Route>
              {/* FLIGHT_RECONCILIATION */}
              <Route path={routes.FLIGHT_RECONCILIATION_ERROR} element={<Reconciliation />} />
              <Route path={routes.FLIGHT_RECONCILIATION_ERROR}>
                <Route path=':id' element={<ErrorDetailPage />} />
              </Route>
            </Route>
            {/* hotel */}
            <Route path={routes.HOTEL}>
              {/* HOTEL_ONLINE */}
              <Route path={routes.HOTEL_ONLINE} element={<HotelOnline />} />
              <Route path={routes.HOTEL_ONLINE}>
                <Route path=':id' element={<HotelOnlineDetail />} />
              </Route>
              {/* HOTEL_OFFLINE */}
              <Route path={routes.HOTEL_OFFLINE} element={<HotelOffline />} />
              <Route path={routes.HOTEL_OFFLINE}>
                <Route path=':id' element={<HotelOnlineDetail />} />
              </Route>
            </Route>
            {/* approval */}
            <Route path={routes.APPROVAL}>
              {/* FLIGHT_APPROVAL */}
              <Route path={routes.FLIGHT} element={<FlightApproval />} />
              <Route path={routes.HOTEL} element={<HotelApproval />} />
            </Route>
            {/* payment sp */}
            <Route path={routes.PAYMENT_SUPPORT}>
              {/* bank */}
              <Route path={routes.BANK_TRANSFER} element={<BankTransfer />} />
              <Route path={routes.CREDIT_TRANSFER} element={<CreditHoldTransaction />} />
            </Route>
          </Route>
          {/* OTHER */}
          <Route path={routes.OTHER}>
            <Route path={routes.OTHER_SALE_MANAGER} element={<Sample />} />
          </Route>
        </Route>

        {/* MARKETING */}
        <Route
          path={routes.MARKETING}
          element={<ProtectedRoute redirectPath={routes.LOGIN} isAllowed={isAuthenticate()} />}
        >
          <Route path={routes.MARKETING_BREAKING_NEWS} element={<Sample />} />
          <Route path={routes.MARKETING_PROMOTION_CODE} element={<Sample />} />
        </Route>
        {/* Công cụ hỗ trợ */}
        <Route
          path={routes.SUPPORT_TOOLS}
          element={<ProtectedRoute redirectPath={routes.LOGIN} isAllowed={isAuthenticate()} />}
        >
          <Route path={routes.PAYMENT_TOOL} element={<PaymentSupportTools />} />
        </Route>

        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  );
};

interface SomeComponentProps {
  redirectPath?: string;
  children?: ReactNode;
  isAllowed: boolean;
}

const ProtectedRoute: FC<SomeComponentProps> = ({
  redirectPath = '/login',
  children = null,
  isAllowed,
}) => {
  const collapsible: boolean = useAppSelector((state) => state.systemReducer.collapsible);
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return (
    <Layout>
      <Loading />
      <HeaderContainer />
      <Layout hasSider className='container'>
        <LeftSideBar />
        <Layout className={`site-layout ${collapsible ? 'site-layout-collap' : ''}`}>
          <Content className='main-content'>{children ? children : <Outlet />}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default RoutesComponent;
