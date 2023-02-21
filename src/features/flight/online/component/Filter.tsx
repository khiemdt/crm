import { useIntl } from 'react-intl';
import { Form, Row, Col, Input, Button } from 'antd';

import '~/features/flight/online/FlightOnline.scss';
import { IconArrowOriented } from '~/assets';
import PopoverSelectCA from '~/components/popover/PopoverSelectCA';
import { listFilterAddFlight, listFilterDefault } from '~/utils/constants/dataOptions';
import { AllowAgentType } from '~/features/systems/systemSlice';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import PopoverSelectAddFields from '~/components/popover/PopoverSelectAddFields';
import ListFilterItems from '~/features/flight/online/component/ListFilterItems';
import {
  LAST_FILTERS_FLIGHT_ONLINE,
  some,
  TIME_OUT_QUERY_API_FLIGHT_SEARCH,
} from '~/utils/constants/constant';
import { useEffect, useState } from 'react';
import { fetFlightBookings } from '~/features/flight/flightSlice';
import SaveAndResetFilter from '~/features/flight/online/component/SaveAndResetFilter';
import { isEmpty, removeFieldEmptyFilter } from '~/utils/helpers/helpers';
import { useSearchParams, useLocation, useNavigate, createSearchParams } from 'react-router-dom';

let timeoutSearch: any = null;

const Filter = () => {
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
      dispatch(fetFlightBookings({ formData: formData, isFilter: true }));
    } else if (key === 'filedAdds') {
      setIsFrist(true);
    }
  };

  const handleSearch = (allValues: object) => {
    handleFetData(allValues);
  };

  const handleChangeRoute = (formData: object) => {
    const searchParams = removeFieldEmptyFilter(formData);
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
      // if (!isEmpty(formData.dealId)) {
      //   window.open(`${location.pathname}/${formData?.dealId}`, '_blank');
      //   return;
      // }
      handleChangeRoute(formData);
      dispatch(fetFlightBookings({ formData: formData, isFilter: true }));
    }, TIME_OUT_QUERY_API_FLIGHT_SEARCH);
  };

  const handleSetInitFilter = () => {
    const addFiltersTemp = localStorage.getItem(LAST_FILTERS_FLIGHT_ONLINE);
    if (!isEmpty(location.search)) {
      let formTemp = {};
      let createdDate = {};
      let departureDate = {};
      for (const entry of searchParams.entries()) {
        const [param, value] = entry;
        if (
          param === 'filedAdds' ||
          param === 'agentList' ||
          param === 'handlingStatuses' ||
          param === 'paymentStatuses' ||
          param === 'paymentMethods' ||
          param === 'others'
        ) {
          formTemp = {
            ...formTemp,
            [param]: value.split(',').map(String),
          };
        } else if (param === 'airlineIds' || param === 'caIds') {
          formTemp = {
            ...formTemp,
            [param]: value.split(',').map(Number),
          };
        } else if (param === 'createdFromDate' || param === 'createdToDate') {
          createdDate = {
            ...createdDate,
            [param]: value,
          };
        } else if (param === 'departureFromDate' || param === 'departureToDate') {
          departureDate = {
            ...departureDate,
            [param]: value,
          };
        } else if (param === 'confirmStatus') {
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
      if (!isEmpty(departureDate)) {
        formTemp = {
          ...formTemp,
          departureDate,
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
          {listFilterDefault.map((el) => (
            <Col span={4} key={el.key}>
              <Form.Item name={el.key} rules={el.rules || undefined}>
                <Input
                  onPressEnter={(ele) => {
                    if (el.key == 'dealId' && ele?.target?.value) {
                      window.open(`${location.pathname}/${ele?.target?.value}`, '_blank');
                    }
                  }}
                  allowClear
                  placeholder={intl.formatMessage({ id: el.name })}
                />
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
        <ListFilterItems isFirst={isFirst} listItem={listFilterAddFlight} />
        <Form.Item
          name='filedAdds'
          shouldUpdate={(prevValues, curValues) => prevValues.filedAdds !== curValues.filedAdds}
        >
          <PopoverSelectAddFields
            listItem={listFilterAddFlight}
            value={form.getFieldValue('filedAdds')}
            handleSelected={(idSelecteds: string[]) => handleChangeField('filedAdds', idSelecteds)}
            title='IDS_TEXT_ADD'
          />
        </Form.Item>
        <SaveAndResetFilter />
      </Form>
    </div>
  );
};
export default Filter;
