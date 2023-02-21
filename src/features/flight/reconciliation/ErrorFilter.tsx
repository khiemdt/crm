import { useEffect, useState, useContext } from 'react';
import { Form, Input, Button, message } from 'antd';
import {
  some,
  LAST_FILTERS_FLIGHT_ONLINE,
  TIME_OUT_QUERY_API_FLIGHT_SEARCH,
} from '~/utils/constants/constant';
import { listFilterAddReconciliation } from '~/utils/constants/dataOptions';
import PopoverSelectCA from 'src/components/popover/PopoverSelectCA';
import PopoverSelectAddFields from 'src/components/popover/PopoverSelectAddFields';
import './Reconciliation.scss';
import ListFilterItems from './ListFilterItems';
import SaveAndResetFilter from './SaveAndResetFilter';
import { isEmpty, removeFieldEmptyFilter } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';
import { AllowAgentType } from '../flightSlice';
import { getErrorTagsHandling, getErrorTagsStatus } from '~/apis/flight';
import { UserInfo } from '~/components/Layout/LeftSideBar';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';

let timeoutSearch: any = null;

const ErrorFilter = (props: any) => {
  const {
    rowKeys,
    handleSuccessAction,
    setRowKeys,
    reconcileData,
    fetFlightBookings,
    setPagingOnline,
  } = props;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const [isFirst, setIsFrist] = useState(false);
  const userInfo: UserInfo = useAppSelector((state) => state.systemReducer.userInfo);
  const allowAgents: AllowAgentType[] = useAppSelector((state) => state.systemReducer.allowAgents);

  const updateStatusTag = async (dataDto = {}) => {
    try {
      const { data } = await getErrorTagsStatus(dataDto);
      if (data.code === 200) {
        setRowKeys([]);
        message.success('Thực hiện thành công!');
        handleSuccessAction();
      } else {
        message.error(data.message);
      }
    } catch (error) {}
  };

  const handlingError = async (dataDto = {}) => {
    try {
      const { data } = await getErrorTagsHandling(dataDto);
      if (data.code === 200) {
        // setRowKeys([]);
        message.success('Thực hiện thành công!');
        handleSuccessAction();
      } else {
        message.error(data.message);
      }
    } catch (error) {}
  };

  const handleSetInitFilter = () => {
    const addFiltersTemp = localStorage.getItem(LAST_FILTERS_FLIGHT_ONLINE);
    if (!isEmpty(location.search)) {
      let formTemp = {};
      let reconcileDate = {};
      let paging = {};

      for (const entry of searchParams.entries()) {
        const [param, value] = entry;
        if (param === 'filedAdds' || param === 'statuses' || param === 'departments') {
          formTemp = {
            ...formTemp,
            [param]: value.split(',').map(String),
          };
        } else if (param === 'caIds' || param === 'errorTagIds' || param === 'solutionIds') {
          formTemp = {
            ...formTemp,
            [param]: value.split(',').map(Number),
          };
        } else if (param === 'reconcileDateFrom' || param === 'reconcileDateTo') {
          reconcileDate = {
            ...reconcileDate,
            [param]: value,
          };
        } else if (param === 'page' || param === 'size') {
          paging = {
            ...paging,
            [param]: value,
          };
        } else {
          formTemp = {
            ...formTemp,
            [param]: value,
          };
        }
      }
      if (!isEmpty(paging)) {
        setPagingOnline(paging);
      }
      if (!isEmpty(reconcileDate)) {
        formTemp = {
          ...formTemp,
          reconcileDate,
        };
      }
      // set form
      form.setFieldsValue(formTemp);
      fetFlightBookings(formTemp, true);
    } else {
      fetFlightBookings({}, true);
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

  const handleChangeField = (key: string, values: string[]) => {
    form.setFieldsValue({ [key]: values });
    if (key === 'caIds') {
      const formData = {
        ...form.getFieldsValue(true),
        caIds: values,
      };
      handleChangeRoute(formData);
      fetFlightBookings(formData, true);
    } else if (key === 'filedAdds') {
      setIsFrist(true);
    }
  };

  const handleChangeStatus = (status: string) => {
    updateStatusTag({
      status,
      ids: rowKeys,
    });
  };

  const handlingErrorUser = () => {
    handlingError({
      force: false,
      reconcileErrorTagIds: rowKeys,
      userId: userInfo?.id,
    });
  };

  const isCheckEnable = () => {
    let result = false;
    if (isEmpty(rowKeys)) {
      result = true;
    }
    rowKeys.forEach((el: any) => {
      const item = reconcileData?.items?.find((it: any) => it.id === el) || {};
      if (item.status === 'REJECT' || item.status === 'CONFIRM') {
        result = true;
      }
    });
    return result;
  };

  const isCheckEnableHandling = () => {
    let result = false;
    if (isEmpty(rowKeys)) {
      result = true;
    }
    rowKeys.forEach((el: any) => {
      const item = reconcileData?.items?.find((it: any) => it.id === el) || {};
      if (!isEmpty(item.handlingUserId)) {
        result = true;
      }
    });
    return result;
  };

  const handleSearch = (allValues: object) => {
    handleFetData(allValues);
  };

  const handleFetData = (formData: some = {}) => {
    clearTimeout(timeoutSearch);
    timeoutSearch = setTimeout(() => {
      handleChangeRoute(formData);
      fetFlightBookings(formData, true);
    }, TIME_OUT_QUERY_API_FLIGHT_SEARCH);
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

  return (
    <div className='filter-common  filter-container' style={{ justifyContent: 'space-between' }}>
      <Form
        form={form}
        scrollToFirstError
        colon={false}
        hideRequiredMark
        className='form-customer filter-form-flight'
        initialValues={{
          bookingId: '',
          caIds: [],
          filedAdds: [],
        }}
        onValuesChange={(changedValues, allValues) => {
          if (changedValues.bookingId !== undefined) {
            const temp = changedValues.bookingId || '';
            const mystring = temp.replace(/\D/g, '');
            form.setFieldsValue({
              bookingId: mystring,
            });
            handleSearch({
              ...allValues,
              bookingId: mystring,
            });
          }
        }}
      >
        <Form.Item key='bookingId' name='bookingId' style={{ marginRight: 10 }}>
          <Input allowClear placeholder='Mã đơn hàng' />
        </Form.Item>
        <Form.Item
          name='caIds'
          shouldUpdate={(prevValues, curValues) => prevValues.caIds !== curValues.caIds}
        >
          <PopoverSelectCA
            listItem={allowAgents || []}
            value={form.getFieldValue('caIds')}
            handleSelected={(idSelecteds: string[]) => handleChangeField('caIds', idSelecteds)}
            title='IDS_TEXT_CA_'
          />
        </Form.Item>
        <ListFilterItems
          isFirst={isFirst}
          listItem={listFilterAddReconciliation}
          fetFlightBookings={fetFlightBookings}
        />
        <Form.Item
          name='filedAdds'
          shouldUpdate={(prevValues, curValues) => prevValues.filedAdds !== curValues.filedAdds}
        >
          <PopoverSelectAddFields
            listItem={listFilterAddReconciliation}
            value={form.getFieldValue('filedAdds')}
            handleSelected={(idSelecteds: string[]) => handleChangeField('filedAdds', idSelecteds)}
            title='IDS_TEXT_ADD'
          />
        </Form.Item>
        <SaveAndResetFilter fetFlightBookings={fetFlightBookings} />
      </Form>
      <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type='primary'
          ghost
          style={{ marginRight: 12 }}
          disabled={isCheckEnableHandling()}
          onClick={handlingErrorUser}
        >
          Nhận xử lý
        </Button>
        {/* <Button
          type='primary'
          style={{ marginRight: 12 }}
          disabled={isCheckEnable()}
          onClick={() => handleChangeStatus('REJECT')}
        >
          Từ chối
        </Button> */}
        <Button
          type='primary'
          disabled={isCheckEnable()}
          onClick={() => handleChangeStatus('CONFIRM')}
        >
          Xác nhận lỗi
        </Button>
      </div>
    </div>
  );
};

export default ErrorFilter;
