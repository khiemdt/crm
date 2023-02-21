import { Form } from 'antd';
import PopoverInput from '~/components/popover/PopoverInput';
import PopoverRadio from '~/components/popover/PopoverRadio';
import PopoverRangePicker from '~/components/popover/PopoverRangePicker';
import PopoverSelect from '~/components/popover/PopoverSelect';
import PopoverSelectFields from '~/components/popover/PopoverSelectFields';
import { some, TIME_OUT_QUERY_API_FLIGHT_REMOVE_FIELD } from '~/utils/constants/constant';
import { ItemFilterAddFlight, listFilterAddHotel } from '~/utils/constants/dataOptions';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { fetHotelBookings } from '~/features/hotel/hotelSlice';
import { useEffect } from 'react';
import { removeFieldEmptyFilterHotel } from '~/utils/helpers/helpers';
import { createSearchParams, useNavigate } from 'react-router-dom';
import PopoverSingleSelect from '~/components/popover/PopoverSingleSelect';
import PopoverSelectSubGroup from '~/components/popover/PopoverSelectSubGroup';
import PopoverAutoComplete from '~/components/popover/PopoverAutoComplete';

let timeoutSearch: any = null;

const ListFilterItems = (props: any) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const form = Form.useFormInstance();
  const filedAdds: string[] = Form.useWatch('filedAdds', form);
  const salesList = useAppSelector((state: some) => state?.flightReducer.salesList);
  const staticData = useAppSelector((state: some) => state?.hotelReducer.staticData);
  const { isFirst } = props;
  const getItemAddFields = (key: string) => {
    return listFilterAddHotel.find((el: any) => el.key === key);
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
    dispatch(fetHotelBookings({ formData: formData, isFilter: true }));
  };

  const handleFetData = (formData: some = {}) => {
    clearTimeout(timeoutSearch);
    timeoutSearch = setTimeout(() => {
      handleChangeRoute(formData);
      dispatch(fetHotelBookings({ formData: formData, isFilter: true }));
    }, TIME_OUT_QUERY_API_FLIGHT_REMOVE_FIELD);
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

  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearch);
    };
  }, []);

  const getListOptions = (key: string) => {
    switch (key) {
      case 'handler':
        return salesList;
      case 'hotelCategories':
      case 'hotelSubCategories':
        return staticData?.hotelCategories;
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
            listFilterAdd={listFilterAddHotel}
          />
        );
      }
      case 'selectSingle': {
        return (
          <PopoverSingleSelect
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
      case 'selectSubGroup': {
        return (
          <PopoverSelectSubGroup
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
            isDefault={false}
          />
        );
      }
      case 'autoSearch': {
        return (
          <PopoverAutoComplete
            title={itemSelected?.name}
            handleRemoveField={() => handleRemoveField(el)}
            defaultVisible={idx === filedAdds.length - 1 && isFirst}
            name={el}
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
