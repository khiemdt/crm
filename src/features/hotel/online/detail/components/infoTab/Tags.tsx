import { Checkbox, Col, message, Row } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useEffect, useState } from 'react';
import { getBookingTags, updateBookingTag } from '~/apis/flight';
import { tagsHotel } from '~/apis/hotel';
import { some } from '~/utils/constants/constant';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';

const getDataTag = (tags: some[], checkedValue: CheckboxValueType[]) => {
  let result: some[] = [];
  checkedValue.forEach((el) => {
    const temp: some | undefined = tags.find((item) => item.id === el) || {};
    if (!isEmpty(temp)) {
      result.push(temp);
    }
  });
  return result;
};

const Tags = () => {
  const booking = useAppSelector((state) => state.hotelReducer?.hotelOnlineDetail);

  const [actionListAllTags, setActionListAllTags] = useState<boolean>(false);
  const [tags, setTags] = useState<some[]>([]);
  const [activeTags, setActiveTags] = useState<some[]>([]);

  const dataTags = () => (actionListAllTags ? tags : activeTags?.length ? activeTags : tags);

  const fetTagHotelBookingDetail = async (queryParams: object) => {
    try {
      const { data } = await tagsHotel(queryParams);
      if (data.code === 200) {
        setTags(data?.data);
      } else {
        message?.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetGetBookingTags = async (queryParams: object) => {
    try {
      const { data } = await getBookingTags(queryParams);
      if (data.code === 200) {
        setActiveTags(data?.data);
      } else {
        message?.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetUpdateBookingTag = async (query: object, checkedValue: CheckboxValueType[]) => {
    try {
      const { data } = await updateBookingTag(query);
      if (data.code === 200) {
        message?.success('Lưu tag thành công');
        setActiveTags(tags?.filter((val) => checkedValue?.includes(val?.id)));
      } else {
        message?.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    !isEmpty(booking) &&
      fetTagHotelBookingDetail({
        caId: booking?.caInfo?.id,
        module: 'hotel',
      });
    !isEmpty(booking) &&
      fetGetBookingTags({
        bookingId: booking?.id,
        module: 'hotel',
      });
  }, []);

  return (
    <div className='wrapper-tags'>
      <div
        className='wrapper-tags-head'
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <h2>Tag</h2>
        {activeTags?.length > 0 && (
          <button onClick={() => setActionListAllTags(!actionListAllTags)}>
            {actionListAllTags ? 'Thu gọn' : 'Tất cả'}
          </button>
        )}
      </div>
      <Checkbox.Group
        style={{ width: '100%' }}
        onChange={(checkedValue: CheckboxValueType[]) => {
          fetUpdateBookingTag(
            {
              bookingId: booking?.id,
              tags: getDataTag(tags, checkedValue),
              module: 'hotel',
            },
            checkedValue,
          );
        }}
        value={activeTags?.map((el: some) => el?.id)}
      >
        <Row gutter={16}>
          {dataTags()?.map((val: some) => {
            return (
              <Col span={6} key={val?.id}>
                <Checkbox value={val?.id}>{val?.name}</Checkbox>
              </Col>
            );
          })}
        </Row>
      </Checkbox.Group>
    </div>
  );
};

export default Tags;
