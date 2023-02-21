import { useIntl } from 'react-intl';
import { Form, Row, Col, Input, Button } from 'antd';

import '~/features/flight/online/FlightOnline.scss';
import { IconArrowOriented } from '~/assets';
import PopoverSelectCA from '~/components/popover/PopoverSelectCA';
import { listFilterAddHotel, listFilterDefaultHotel } from '~/utils/constants/dataOptions';
import { AllowAgentType } from '~/features/systems/systemSlice';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import PopoverSelectAddFields from '~/components/popover/PopoverSelectAddFields';
import ListFilterItems from '~/features/hotel/online/components/ListFilterItems';
import {
  LAST_FILTERS_HOTEL_ONLINE,
  some,
  TIME_OUT_QUERY_API_FLIGHT_SEARCH,
} from '~/utils/constants/constant';
import { useEffect, useState } from 'react';
import { fetHotelBookings } from '~/features/hotel/hotelSlice';
import SaveAndResetFilter from '~/features/hotel/online/components/SaveAndResetFilter';
import { isEmpty, removeFieldEmptyFilterHotel } from '~/utils/helpers/helpers';
import { useSearchParams, useLocation, useNavigate, createSearchParams } from 'react-router-dom';

let timeoutSearch: any = null;

const Filters = () => {
  const intl = useIntl();
  let [searchParams] = useSearchParams();
  let location = useLocation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isFirst, setIsFrist] = useState(false);
  const allowAgents: AllowAgentType[] = useAppSelector((state) => state.systemReducer.allowAgents);

  const handleChangeField = (key: string, values: string[]) => {
    form.setFieldsValue({ [key]: values });
    if (key === 'caIds') {
      const formData = {
        ...form.getFieldsValue(true),
        caIds: values,
      };
      navigate({
        pathname: location.pathname,
        search: createSearchParams({
          ...formData,
        }).toString(),
      });
      handleChangeRoute(formData);
      dispatch(fetHotelBookings({ formData: formData, isFilter: true }));
    } else if (key === 'filedAdds') {
      setIsFrist(true);
    }
  };

  const handleSearch = (allValues: object) => {
    handleFetData(allValues);
  };

  const handleChangeRoute = (formData: object) => {
    const searchParams = removeFieldEmptyFilterHotel(formData);
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        ...searchParams,
      }).toString(),
    });
  };

  const handleFetData = (formData: some = {}) => {
    clearTimeout(timeoutSearch);
    timeoutSearch = setTimeout(() => {
      handleChangeRoute(formData);
      dispatch(fetHotelBookings({ formData: formData, isFilter: true }));
    }, TIME_OUT_QUERY_API_FLIGHT_SEARCH);
  };

  const handleSetInitFilter = () => {
    const addFiltersTemp = localStorage.getItem(LAST_FILTERS_HOTEL_ONLINE);
    if (!isEmpty(location.search)) {
      let formTemp = {};
      let createdDate = {};
      let checkIn = {};
      let checkOut = {};
      let paymentDate = {};
      for (const entry of searchParams.entries()) {
        const [param, value] = entry;
        if (
          param === 'filedAdds' ||
          param === 'agentList' ||
          param === 'handlingStatuses' ||
          param === 'paymentStatuses' ||
          param === 'paymentMethods' ||
          param === 'others' ||
          param === 'payProviderStatuses' ||
          param === 'refundPaymentFilter'
        ) {
          formTemp = {
            ...formTemp,
            [param]: value.split(',').map(String),
          };
        } else if (
          param === 'caIds' ||
          param === 'hotelCategories' ||
          param === 'hotelSubCategories'
        ) {
          formTemp = {
            ...formTemp,
            [param]: value.split(',').map(Number),
          };
        } else if (param === 'createdFromDate' || param === 'createdToDate') {
          createdDate = {
            ...createdDate,
            [param]: value,
          };
        } else if (param === 'checkinFromDate' || param === 'checkinToDate') {
          checkIn = {
            ...checkIn,
            [param]: value,
          };
        } else if (param === 'checkOutFromDate' || param === 'checkOutToDate') {
          checkOut = {
            ...checkOut,
            [param]: value,
          };
        } else if (param === 'paymentFromDate' || param === 'paymentToDate') {
          paymentDate = {
            ...paymentDate,
            [param]: value,
          };
        } else if (param === 'confirmStatus' || param === 'showMemberBookings') {
          formTemp = {
            ...formTemp,
            [param]: value === 'true' ? true : false,
          };
        } else if (param === 'page' || param === 'pageSize') {
        } else {
          formTemp = {
            ...formTemp,
            [param]: value,
          };
        }
      }
      if (!isEmpty(createdDate)) {
        formTemp = {
          ...formTemp,
          createdDate,
        };
      }
      if (!isEmpty(checkIn)) {
        formTemp = {
          ...formTemp,
          checkIn,
        };
      }
      if (!isEmpty(checkOut)) {
        formTemp = {
          ...formTemp,
          checkOut,
        };
      }
      if (!isEmpty(paymentDate)) {
        formTemp = {
          ...formTemp,
          paymentDate,
        };
      }
      // set form
      form.setFieldsValue(formTemp);
    } else {
      if (!isEmpty(addFiltersTemp)) {
        form.setFieldsValue({ filedAdds: JSON.parse(addFiltersTemp || '') });
      }
    }
  };

  useEffect(() => {
    handleSetInitFilter();
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearch);
    };
  }, []);

  return (
    <div className='filter-container'>
      <Form
        form={form}
        scrollToFirstError
        colon={false}
        hideRequiredMark
        className='filter-form-flight'
        initialValues={{
          caIds: [],
          filedAdds: [],
        }}
        onValuesChange={(changedValues, allValues) => {
          if (changedValues.dealId !== undefined) {
            const temp = changedValues.dealId || '';
            const mystring = temp.replace(/\D/g, '');
            form.setFieldsValue({
              dealId: mystring,
            });
            handleSearch({
              ...allValues,
              dealId: mystring,
            });
          } else {
            handleSearch(allValues);
          }
        }}
      >
        <Row gutter={12} className='left-filter'>
          {listFilterDefaultHotel.map((el) => (
            <Col key={el.key}>
              <Form.Item name={el.key} rules={el.rules || undefined}>
                <Input allowClear placeholder={intl.formatMessage({ id: el.name })} />
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Form.Item
          name='caIds'
          shouldUpdate={(prevValues, curValues) => prevValues.caIds !== curValues.caIds}
        >
          <PopoverSelectCA
            listItem={allowAgents}
            value={form.getFieldValue('caIds')}
            handleSelected={(idSelecteds: string[]) => handleChangeField('caIds', idSelecteds)}
            title='IDS_TEXT_CA'
          />
        </Form.Item>
        <ListFilterItems isFirst={isFirst} listItem={listFilterAddHotel} />
        <Form.Item
          name='filedAdds'
          shouldUpdate={(prevValues, curValues) => prevValues.filedAdds !== curValues.filedAdds}
        >
          <PopoverSelectAddFields
            listItem={listFilterAddHotel}
            value={form.getFieldValue('filedAdds')}
            handleSelected={(idSelecteds: string[]) => handleChangeField('filedAdds', idSelecteds)}
            title='IDS_TEXT_ADD'
          />
        </Form.Item>
        <SaveAndResetFilter />
      </Form>
      {/* <Button className='btn-download-report'>
        <IconArrowOriented style={{ marginRight: 4 }} />
        {intl.formatMessage({ id: 'IDS_TEXT_DOWNLOAD_REPORT' })}
      </Button> */}
    </div>
  );
};
export default Filters;
