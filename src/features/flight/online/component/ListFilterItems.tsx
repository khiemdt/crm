import { Form } from 'antd';
import PopoverInput from '~/components/popover/PopoverInput';
import PopoverRadio from '~/components/popover/PopoverRadio';
import PopoverRangePicker from '~/components/popover/PopoverRangePicker';
import PopoverSelect from '~/components/popover/PopoverSelect';
import PopoverSelectFields from '~/components/popover/PopoverSelectFields';
import { AirlinesType } from '~/features/systems/systemSlice';
import { some, TIME_OUT_QUERY_API_FLIGHT_REMOVE_FIELD } from '~/utils/constants/constant';
import { ItemFilterAddFlight, listFilterAddFlight } from '~/utils/constants/dataOptions';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { fetFlightBookings, fetGeneralInfo } from '~/features/flight/flightSlice';
import { useEffect } from 'react';
import { removeFieldEmptyFilter } from '~/utils/helpers/helpers';
import { createSearchParams, useNavigate } from 'react-router-dom';

let timeoutSearch: any = null;

const ListFilterItems = (props: any) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const form = Form.useFormInstance();
  const filedAdds: string[] = Form.useWatch('filedAdds', form);
  const airlines: AirlinesType[] = useAppSelector((state) => state.systemReducer.airlines);
  const generalInfo = useAppSelector((state) => state.flightReducer.generalInfo);

  const { isFirst } = props;
  const getItemAddFields = (key: string) => {
    return listFilterAddFlight.find((el) => el.key === key);
  };

  const handleRemoveField = (key: string) => {
    const filedAddsTemp = filedAdds.filter((el) => el !== key);
    form.setFieldsValue({
      filedAdds: filedAddsTemp,
      [key]: undefined,
    });
    handleFetData({
      ...form.getFieldsValue(true),
      [key]: undefined,
    });
  };

  const handleFetDataChangeField = (formData: some = {}) => {
    handleChangeRoute(formData);
    dispatch(fetFlightBookings({ formData: formData, isFilter: true }));
  };

  const handleFetData = (formData: some = {}) => {
    clearTimeout(timeoutSearch);
    timeoutSearch = setTimeout(() => {
      handleChangeRoute(formData);
      dispatch(fetFlightBookings({ formData: formData, isFilter: true }));
    }, TIME_OUT_QUERY_API_FLIGHT_REMOVE_FIELD);
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

  useEffect(() => {
    dispatch(fetGeneralInfo({}));
    return () => {
      clearTimeout(timeoutSearch);
    };
  }, []);

  const getListOptions = (key: string) => {
    switch (key) {
      case 'airlineIds':
        return airlines;
      case 'agentList':
        return generalInfo?.agencies?.map((el: some) => ({
          ...el,
          id: el.code,
        }));
    }
    return [];
  };

  const getContentType = (
    type: string,
    el: string,
    idx: number,
    itemSelected: ItemFilterAddFlight | undefined,
  ) => {
    switch (type) {
      case 'text': {
        return (
          <PopoverInput
            title={itemSelected?.name}
            handleRemoveField={() => handleRemoveField(el)}
            defaultVisible={idx === filedAdds.length - 1 && isFirst}
            name={el}
            handleFetData={handleFetDataChangeField}
          />
        );
      }
      case 'date': {
        return (
          <PopoverRangePicker
            title={itemSelected?.name}
            handleRemoveField={() => handleRemoveField(el)}
            defaultVisible={idx === filedAdds.length - 1 && isFirst}
            name={el}
            handleFetData={handleFetDataChangeField}
            listFilterAdd={listFilterAddFlight}
          />
        );
      }
      case 'select': {
        return (
          <PopoverSelect
            title={itemSelected?.name}
            handleRemoveField={() => handleRemoveField(el)}
            defaultVisible={idx === filedAdds.length - 1 && isFirst}
            name={el}
            listItem={
              itemSelected?.isListOptionsDefault
                ? itemSelected?.listOptions || []
                : getListOptions(el)
            }
            handleFetData={handleFetDataChangeField}
          />
        );
      }
      case 'radio': {
        return (
          <PopoverRadio
            title={itemSelected?.name}
            handleRemoveField={() => handleRemoveField(el)}
            defaultVisible={idx === filedAdds.length - 1 && isFirst}
            name={el}
            options={itemSelected?.options}
            handleFetData={handleFetDataChangeField}
          />
        );
      }
      case 'addFileds': {
        return (
          <PopoverSelectFields
            title={itemSelected?.name}
            handleRemoveField={() => handleRemoveField(el)}
            defaultVisible={idx === filedAdds.length - 1 && isFirst}
            name={el}
            listFields={itemSelected?.listFields || []}
            handleFetData={handleFetDataChangeField}
          />
        );
      }
    }
  };

  return (
    <>
      {filedAdds?.map((el: string, idx: number) => {
        const itemSelected = getItemAddFields(el);
        return (
          <Form.Item name={el} key={el}>
            {getContentType(itemSelected?.type || '', el, idx, itemSelected)}
          </Form.Item>
        );
      })}
    </>
  );
};

export default ListFilterItems;
