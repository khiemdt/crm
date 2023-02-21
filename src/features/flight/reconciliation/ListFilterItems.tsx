import { Form } from 'antd';
import PopoverInput from 'src/components/popover/PopoverInput';
import PopoverSelect from 'src/components/popover/PopoverSelect';
import PopoverRangePicker from 'src/components/popover/PopoverRangePicker';
import { some, TIME_OUT_QUERY_API_FLIGHT_REMOVE_FIELD } from '~/utils/constants/constant';
import { listFilterAddReconciliation, ItemFilterAddFlight } from '~/utils/constants/dataOptions';
import { useEffect, useState } from 'react';
import { isEmpty, removeFieldEmptyFilter } from '~/utils/helpers/helpers';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { getErrorTags, getErrorTagsSolutions } from '~/apis/flight';

let timeoutSearch: any = null;

const ListFilterItems = (props: any) => {
  const form = Form.useFormInstance();
  const navigate = useNavigate();
  const filedAdds: string[] = Form.useWatch('filedAdds', form);
  const { isFirst, fetFlightBookings } = props;

  const [reconcileErrorTag, setReconcileErrorTag] = useState<some>({});
  const [reconcileSolutions, setReconcileSolutions] = useState<some>({});

  useEffect(() => {
    fetReconcileErrorTag();
    fetReconcileSolutions();
  }, []);

  const fetReconcileErrorTag = async () => {
    try {
      const { data } = await getErrorTags();
      if (data.code === 200) {
        setReconcileErrorTag(data.data);
      }
    } catch (error) {}
  };

  const fetReconcileSolutions = async () => {
    try {
      const { data } = await getErrorTagsSolutions();
      if (data.code === 200) {
        setReconcileSolutions(data.data);
      }
    } catch (error) {}
  };

  const getItemAddFields = (key: string) => {
    return listFilterAddReconciliation.find((el: any) => el.key === key);
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
    fetFlightBookings(formData, true);
  };

  const handleFetData = (formData: some = {}) => {
    clearTimeout(timeoutSearch);
    timeoutSearch = setTimeout(() => {
      handleChangeRoute(formData);
      fetFlightBookings(formData, true);
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
    return () => {
      clearTimeout(timeoutSearch);
    };
  }, []);

  const getListOptions = (key: string) => {
    switch (key) {
      case 'errorTagIds':
        return (
          reconcileErrorTag?.items?.map((el: some) => ({
            ...el,
            nameCustomer: `(${el.department}) ${el.name}`,
          })) || []
        );
      case 'solutionIds':
        return reconcileSolutions?.items || [];
      case 'departments': {
        let result: any[] = [];
        reconcileErrorTag?.items?.forEach((el: some) => {
          const item = result.find((it: some) => it.id === el.department);
          if (isEmpty(item)) {
            result.push({
              id: el.department,
              name: el.department,
            });
          }
        });
        return result;
      }
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
            listFilterAdd={listFilterAddReconciliation}
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
      default:
        return null;
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
