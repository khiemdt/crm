import Cookie from 'js-cookie';
import CryptoJS from 'crypto-js';
import DeviceDetector from 'ua-parser-js';

import * as constants from '~/utils/constants/constant';
import { some } from '~/utils/constants/constant';
import { listAgeCategory } from '../constants/dataOptions';
import moment from 'moment';

export function isAuthenticate() {
  return !!Cookie.get(constants.TOKEN);
}

const has = Object.prototype.hasOwnProperty;

export const isEmpty = (prop: any) => {
  return (
    prop === null ||
    prop === undefined ||
    (has.call(prop, 'length') && prop.length === 0) ||
    (prop.constructor === Object && Object.keys(prop).length === 0)
  );
};

export const isRestrict = (pathname: string, roles: Array<string>) => {
  let result = isEmpty(roles);
  if (!isEmpty(constants.ROLE_TABLE[pathname]) && !isEmpty(roles)) {
    roles.forEach((el) => {
      const x = constants.ROLE_TABLE[pathname].find((it) => it === el);
      if (!isEmpty(x)) {
        result = true;
      }
    });
  }
  return result;
};

export const getAppHash = () => {
  let timeStamp = new Date().getTime();
  timeStamp = timeStamp / 1000 - ((timeStamp / 1000) % 300);
  let str = `${timeStamp}:${import.meta.env.VITE_PUBLIC_HASH_KEY}`;
  const hash = CryptoJS.SHA256(str);
  const hashStr = CryptoJS.enc.Base64.stringify(hash);
  return hashStr;
};

export const getPlatform = () => {
  if (!(typeof window === 'undefined')) {
    const device = DeviceDetector(navigator.userAgent);
    if (device.device.type && device.device.type === 'mobile') {
      return 'mobile_web';
    } else {
      return 'website';
    }
  } else {
    return 'website';
  }
};

export const formatAgeCategory = (stt: string) => {
  return listAgeCategory.find((el: some) => el.code == stt)?.name;
};

export const getDeviceInfo = () => {
  if (!(typeof window === 'undefined')) {
    const device = DeviceDetector(navigator.userAgent);
    if (device.device.type && device.device.type === 'mobile') {
      return 'Mobile-Web';
    } else {
      return 'PC-Web';
    }
  } else {
    return 'Server-web';
  }
};

export const removeAccent = (str: string) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  return str;
};

export const getAbsoluteMonths = (momentDate: any) => {
  const months = Number(momentDate.format('MM'));
  const years = Number(momentDate.format('YYYY'));
  return months + years * 12;
};

export const isHandling = (booking: some, userInfo: some) => {
  return booking?.lastSaleId === userInfo?.id && booking.handlingStatus == 'handling';
};

export const getMonthDifference = (startDate: any, endDate: any) => {
  const startMonths = getAbsoluteMonths(startDate);
  const endMonths = !isEmpty(endDate) ? getAbsoluteMonths(endDate) : startMonths;
  return endMonths - startMonths;
};

export const isSameAirline = (booking: some) => {
  if (!booking) {
    return false;
  }
  return (
    booking.isTwoWay &&
    booking.outbound &&
    booking.inbound &&
    booking.outbound?.airline == booking.inbound?.airline &&
    booking.inboundPnrCode &&
    booking.inboundPnrCode &&
    booking.inboundPnrCode == booking.outboundPnrCode
  );
};

export const adapterQueryFlight = (formData: some = {}, paging: some = {}) => {
  let result: some = {};
  let filtersTemp: some = { ...formData };
  delete filtersTemp.filedAdds;
  if (!isEmpty(formData?.createdDate)) {
    filtersTemp = {
      ...filtersTemp,
      createdFromDate: formData.createdDate.createdFromDate,
      createdToDate: formData.createdDate.createdToDate,
    };
    delete filtersTemp.createdDate;
  }
  if (!isEmpty(formData?.departureDate)) {
    filtersTemp = {
      ...filtersTemp,
      departureFromDate: formData.departureDate.departureFromDate,
      departureToDate: formData.departureDate.departureToDate,
    };
    delete filtersTemp.departureDate;
  }
  if (!isEmpty(formData?.others)) {
    formData?.others?.forEach((el: string) => {
      filtersTemp = {
        ...filtersTemp,
        [el]: true,
      };
    });
    delete filtersTemp.others;
  }
  result = {
    filters: filtersTemp,
    paging,
  };
  return result;
};

export const formatMoney = (amount: any = 0, decimalLength = 0, decimal = '.', thousands = ',') => {
  try {
    let decimalCount = Math.abs(decimalLength);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? '-' : '';

    const i: any = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)),
    ).toString();
    const j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : '') +
      '₫'
    );
  } catch (e) {
    throw e;
  }
};

export const taskPaymentStatusFlight = (status: any) => {
  switch (status) {
    case 'WAITING':
      return {
        title: 'Chờ thanh toán',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Đang giữ vé',
      };
    case 'FAIL':
      return {
        title: 'Thanh toán thất bại',
        color: '#FF2C00',
        backGround: '#FFF0ED',
        detailTitle: 'Đặt vé thất bại',
      };
    case 'SUCCESS':
      return {
        title: 'Thanh toán thành công',
        color: '#007864',
        backGround: '#E9FCEE',
        detailTitle: 'Đặt vé thành công',
      };
    case 'HOLDING':
      return {
        title: 'Đang giữ tiền',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Đang giữ tiền',
      };
    default:
      return {
        title: 'Không xác định',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Chưa đặt vé',
      };
  }
};

export const taskStatusFlight = (bookStatus: any) => {
  switch (bookStatus) {
    case 'WAITING':
      return {
        title: 'Đang chờ',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Đang giữ vé',
      };
    case 'FAIL':
      return {
        title: 'Thất bại',
        color: '#FF2C00',
        backGround: '#FFF0ED',
        detailTitle: 'Đặt vé thất bại',
      };
    case 'SUCCESS':
      return {
        title: 'Thành công',
        color: '#007864',
        backGround: '#E9FCEE',
        detailTitle: 'Đặt vé thành công',
      };
    case 'IN_PROGRESS':
      return {
        title: 'Đang xử lý',
        color: '#FFB30F',
        backGround: '#E9FCEE',
        detailTitle: 'Đang xử lý',
      };
    default:
      return {
        title: 'Không xác định',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Chưa đặt vé',
      };
  }
};

export const getBookStatusFlight = (bookStatus: any) => {
  switch (bookStatus) {
    case 'pending':
      return {
        title: 'Chưa xuất vé',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Chưa xuất vé',
      };
    case 'holding':
      return {
        title: 'Đang giữ chỗ',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Đang giữ chỗ',
      };
    case 'in_progress':
      return {
        title: 'Đang xử lý',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Đang xử lý',
      };
    case 'failed':
      return {
        title: 'Xuất vé thất bại',
        color: '#FF2C00',
        backGround: '#FFF0ED',
        detailTitle: 'Xuất vé thất bại',
      };
    case 'voided':
      return {
        title: 'Đã hủy vé',
        color: '#FF2C00',
        backGround: '#FFF0ED',
        detailTitle: 'Đã hủy vé',
      };
    case 'success':
      return {
        title: 'Thành công',
        color: '#007864',
        backGround: '#E9FCEE',
        detailTitle: 'Đặt vé thành công',
      };
    case 'confirmed':
      return {
        title: 'Đã xuất vé',
        color: '#007864',
        backGround: '#E9FCEE',
        detailTitle: 'Đã xuất vé',
      };
    default:
      return {
        title: 'Chưa đặt vé',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Chưa đặt vé',
      };
  }
};

export const getStatusFlight = (status: any) => {
  switch (status) {
    case 'pending':
      return {
        title: 'Chưa thanh toán',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Chưa thanh toán',
      };
    case 'holding':
      return {
        title: 'Đang giữ chỗ',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Đang giữ chỗ',
      };
    case 'waiting_payment':
      return {
        title: 'Chờ thanh toán',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Chờ thanh toán',
      };
    case 'in_progress':
      return {
        title: 'Đang xử lý',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Đang xử lý',
      };
    case 'failed':
      return {
        title: 'Xuất vé thất bại',
        color: '#FF2C00',
        backGround: '#FFF0ED',
        detailTitle: 'Xuất vé thất bại',
      };
    case 'voided':
      return {
        title: 'Đã hủy vé',
        color: '#FF2C00',
        backGround: '#FFF0ED',
        detailTitle: 'Đã hủy vé',
      };
    case 'refunded':
      return {
        title: 'Đã hoàn tiền',
        color: '#FF2C00',
        backGround: '#FFF0ED',
        detailTitle: 'Đã hoàn tiền',
      };
    case 'success':
      return {
        title: 'Đặt vé thành công',
        color: '#007864',
        backGround: '#E9FCEE',
        detailTitle: 'Đặt vé thành công',
      };
    default:
      return {
        title: 'Chưa đặt vé',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Chưa đặt vé',
      };
  }
};

export const getPnrStatus = (pnrStatus: any) => {
  switch (pnrStatus) {
    case 'voided':
      return {
        title: 'Đã hủy',
        color: '#FF2C00',
        backGround: '#FFF0ED',
      };
    case 'holding':
      return {
        title: 'Đang giữ',
        color: '#FFB30F',
        backGround: '#FFF0ED',
      };
    case 'confirmed':
      return {
        title: 'Đã xuất',
        color: '#007864',
        backGround: '#E9FCEE',
      };
    case 'in_progress':
      return {
        title: 'Thất bại',
        color: '#FF2C00',
        backGround: '#FFF0ED',
      };
    case 'pending':
      return {
        title: 'Chưa có',
        color: '#FFB30F',
        backGround: '#FFF0ED',
      };
    default:
      return {
        title: 'Chưa xác định',
        color: '#FFB30F',
        backGround: '#FFFAEE',
      };
  }
};

export const getSupplierStatus = (pnrStatus: any) => {
  switch (pnrStatus.toLowerCase()) {
    case 'voided':
      return {
        title: 'Đã hủy',
        color: '#FF2C00',
        backGround: '#FFF0ED',
      };
    case 'failed':
      return {
        title: 'Xuất vé thất bại',
        color: '#FFB30F',
        backGround: '#FFF0ED',
      };
    case 'holding':
      return {
        title: 'Đang giữ chỗ',
        color: '#FFB30F',
        backGround: '#FFF0ED',
      };
    case 'confirmed':
      return {
        title: 'Đã xuất vé',
        color: '#007864',
        backGround: '#E9FCEE',
      };
    case 'in_progress':
      return {
        title: 'Đang xử lý',
        color: '#FFB30F',
        backGround: '#FFF0ED',
      };
    case 'pending':
      return {
        title: 'Chưa xác nhận',
        color: '#FFB30F',
        backGround: '#FFF0ED',
      };
    default:
      return {
        title: 'Chưa xác định',
        color: '#FFB30F',
        backGround: '#FFFAEE',
      };
  }
};

export const listPnrStatus = [
  {
    title: 'Chưa có',
    stt: 'pending',
    color: '#FFB30F',
  },
  {
    title: 'Đã hủy',
    stt: 'voided',
    color: '#FF2C00',
  },
  {
    title: 'Đang giữ',
    stt: 'holding',
    color: '#FFB30F',
  },
  {
    title: 'Đã xuất',
    stt: 'confirmed',
    color: '#007864',
  },
  {
    title: 'Thất bại',
    stt: 'failed',
    color: '#FF2C00',
  },
  {
    title: 'Đang xử lý',
    stt: 'in_progress',
    disable: true,
    color: '#FFB30F',
  },
  {
    title: 'Chưa xác định',
    stt: null || 'undecided',
    disable: true,
    color: '#FFB30F',
  },
];

export const listFlightTaskBookStatus = [
  {
    title: 'Đang chờ',
    stt: 'WAITING',
  },
  {
    title: 'Thành công',
    stt: 'SUCCESS',
  },
  {
    title: 'Thất bại',
    stt: 'FAIL',
  },
  {
    title: 'Đang xử lý',
    stt: 'IN_PROGRESS',
    disable: true,
  },
  {
    title: 'Chưa xác định',
    stt: undefined,
    disable: true,
  },
];

export const getPaymentStatusFlight = (paymentStatus: any) => {
  switch (paymentStatus) {
    case 'pending':
      return {
        title: 'Chưa thanh toán',
        color: '#FFB30F',
        detailTitle: 'Chưa thanh toán',
        backGround: '#FFFAEE',
      };
    case 'failed':
      return {
        title: 'Thanh toán thất bại',
        color: '#FF2C00',
        detailTitle: 'Thanh toán thất bại',
        backGround: '#FFF0ED',
      };
    case 'awaiting':
      return {
        title: 'Chờ thanh toán',
        color: '#FFB30F',
        detailTitle: 'Chờ thanh toán',
        backGround: '#FFFAEE',
      };
    case 'cancelling_holding':
      return {
        title: 'Yêu cầu hủy giữ vé',
        color: '#FFB30F',
        detailTitle: 'Yêu cầu hủy giữ vé',
        backGround: '#FFFAEE',
      };
    case 'holding':
      return {
        title: 'Đang giữ tiền',
        color: '#FFB30F',
        detailTitle: 'Đang giữ tiền',
        backGround: '#FFFAEE',
      };
    case 'success':
    case 'completed':
      return {
        title: 'Thành công',
        color: '#007864',
        detailTitle: 'Thanh toán thành công',
        backGround: '#E9FCEE',
      };
    case 'refunded':
      return {
        title: 'Đã hoàn tiền',
        color: '#004ebc',
        detailTitle: 'Đã hoàn tiền',
        backGround: '#FFFAEE',
      };
    default:
      return {
        title: 'Chưa đặt vé',
        color: '#FFB30F',
        detailTitle: 'Chưa đặt vé',
        backGround: '#FFFAEE',
      };
  }
};

export const insuranceBookStatuses = (insuranceBookStatus: any, paymentStatus: string) => {
  switch (insuranceBookStatus) {
    case 'pending':
      return {
        title: 'Chưa thanh toán',
        color: '#FFB30F',
      };
    case 'success':
      return {
        title: 'Đặt thành công',
        color: '#007864',
      };
    case 'fail':
      return {
        title: paymentStatus === 'success' ? 'Đặt bảo hiểm thất bại' : '',
        color: '#FF2C00',
      };
    default:
      return {
        title: 'Không xác định',
        color: '#FFB30F',
      };
  }
};

export const removeFieldEmptyFilter = (formData: some = {}) => {
  let result: some = {};
  if (!isEmpty(formData?.createdDate)) {
    formData = {
      ...formData,
      createdFromDate: formData.createdDate.createdFromDate,
      createdToDate: formData.createdDate.createdToDate,
    };
    delete formData.createdDate;
  }
  if (!isEmpty(formData?.departureDate)) {
    formData = {
      ...formData,
      departureFromDate: formData.departureDate.departureFromDate,
      departureToDate: formData.departureDate.departureToDate,
    };
    delete formData.departureDate;
  }
  const keyNames = Object.keys(formData);
  keyNames.forEach((el) => {
    if (!isEmpty(formData[el])) {
      result = {
        ...result,
        [el]: Array.isArray(formData[el]) ? formData[el].join(',') : formData[el],
      };
    }
  });
  return result;
};

export const getInvoiceStatusFlight = (invoiceStatus: any) => {
  switch (invoiceStatus) {
    case 'open':
      return {
        title: 'Chưa xử lý',
        color: '#FFB30F',
      };
    case 'handling':
      return {
        title: 'Đang xử lý',
        color: '#FFB30F',
      };
    case 'completed':
      return {
        title: 'Đã xử lý',
        color: '#007864',
      };
    case 'initial':
      return {
        title: '',
        color: '#007864',
      };
    case 'cancel':
      return {
        title: 'Đã hủy',
        color: '#FF2C00',
      };
    default:
      return {
        title: '',
        color: '#FF2C00',
      };
  }
};

export const getPaymentHistoryStatus = (historyStatus: string) => {
  switch (historyStatus) {
    case 'settled': {
      return {
        title: 'Thành công',
        color: '#158C32',
      };
    }
    case 'failed': {
      return {
        title: 'Thất bại',
        color: '#FF2C00',
      };
    }
    default: {
      return {
        title: 'Chờ thanh toán',
        color: '#004EBC',
      };
    }
  }
};

export const getStatusPS = (bookStatus: any) => {
  switch (bookStatus) {
    case 'IN_PROGRESS':
      return {
        title: 'Đang xử lý',
        color: '#FFB30F',
        class: 'warning',
      };
    case 'FAILED':
      return {
        title: 'Thất bại',
        color: '#FF2C00',
        class: 'error',
      };
    case 'SUCCESS':
      return {
        title: 'Thành công',
        color: '#007864',
        class: 'success',
      };
    default:
      return {
        title: 'Chưa đặt vé',
        color: '#FFB30F',
        class: 'warning',
      };
  }
};

export const getBookStatusHotel = (bookStatus: any) => {
  switch (bookStatus) {
    case 'refunded':
      return {
        title: 'Hoàn lại tiền',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Hoàn lại tiền',
      };
    case 'pending':
      return {
        title: 'Đang chờ',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Đang chờ',
      };
    case 'waiting':
      return {
        title: 'Đang đặt phòng',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Đang đặt phòng',
      };
    case 'holding':
      return {
        title: 'Đang giữ phòng',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Đang giữ phòng',
      };
    case 'undecided':
      return {
        title: 'Chưa xác định',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Chưa xác định',
      };
    case 'fail':
      return {
        title: 'Thất bại',
        color: '#FF2C00',
        backGround: '#FFF0ED',
        detailTitle: 'Thất bại',
      };
    case 'cancelled':
      return {
        title: 'Đã hủy',
        color: '#FF2C00',
        backGround: '#FFF0ED',
        detailTitle: 'Đã hủy',
      };
    case 'success':
      return {
        title: 'Thành công',
        color: '#007864',
        backGround: '#E9FCEE',
        detailTitle: 'Thành công',
      };
    default:
      return {
        title: 'Chưa đặt vé',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Chưa đặt vé',
      };
  }
};
export const getPaymentStatusHotel = (paymentStatus: any) => {
  switch (paymentStatus) {
    case 'refunded':
      return {
        title: 'Đã hoàn tiền',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Đã hoàn tiền',
      };
    case 'awaiting-payment':
      return {
        title: 'Đang thanh toán',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Đang thanh toán',
      };
    case 'waiting':
      return {
        title: 'Chờ thanh toán',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Chờ thanh toán',
      };
    case 'holding':
      return {
        title: 'Đang giữ phòng',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Đang giữ phòng',
      };
    case 'fail':
      return {
        title: 'Thất bại',
        color: '#FF2C00',
        backGround: '#FFF0ED',
        detailTitle: 'Thất bại',
      };
    case 'cancelling_holding':
      return {
        title: 'Hủy giữ',
        color: '#FF2C00',
        backGround: '#FFF0ED',
        detailTitle: 'Hủy giữ',
      };
    case 'success':
    case 'completed':
      return {
        title: 'Thành công',
        color: '#007864',
        backGround: '#E9FCEE',
        detailTitle: 'Thành công',
      };
    default:
      return {
        title: 'Chưa đặt vé',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Chưa đặt vé',
      };
  }
};

export const getProviderStatusHotelHotel = (providerStatus: any) => {
  switch (providerStatus) {
    case 'fail':
      return {
        title: 'Từ chối',
        color: '#FF2C00',
        backGround: '#FFF0ED',
      };
    case 'success':
      return {
        title: 'Đã xác nhận',
        color: '#007864',
        backGround: '#E9FCEE',
      };
    default:
      return {
        title: 'Chưa xác nhận',
        color: '#FFB30F',
        backGround: '#FFFAEE',
      };
  }
};

export const stringSlug = (string = '') => {
  const separator = '-';
  const includeDot = false;
  let text = string;
  if (!text) text = '';
  text = text.toString().toLowerCase().trim();
  const sets = [
    { to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]' },
    { to: 'c', from: '[ÇĆĈČ]' },
    { to: 'd', from: '[ÐĎĐÞ]' },
    { to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]' },
    { to: 'g', from: '[ĜĞĢǴ]' },
    { to: 'h', from: '[ĤḦ]' },
    { to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]' },
    { to: 'j', from: '[Ĵ]' },
    { to: 'ij', from: '[Ĳ]' },
    { to: 'k', from: '[Ķ]' },
    { to: 'l', from: '[ĹĻĽŁ]' },
    { to: 'm', from: '[Ḿ]' },
    { to: 'n', from: '[ÑŃŅŇ]' },
    { to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]' },
    { to: 'oe', from: '[Œ]' },
    { to: 'p', from: '[ṕ]' },
    { to: 'r', from: '[ŔŖŘ]' },
    { to: 's', from: '[ßŚŜŞŠ]' },
    { to: 't', from: '[ŢŤ]' },
    { to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]' },
    { to: 'w', from: '[ẂŴẀẄ]' },
    { to: 'x', from: '[ẍ]' },
    { to: 'y', from: '[ÝŶŸỲỴỶỸ]' },
    { to: 'z', from: '[ŹŻŽ]' },
  ];

  if (includeDot) sets.push({ to: '-', from: "[·/_.,:;']" });
  else sets.push({ to: '-', from: "[·/_,:;']" });

  sets.forEach((set) => {
    text = text.replace(new RegExp(set.from, 'gi'), set.to);
  });

  text = text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

  if (typeof separator !== 'undefined' && separator !== '-') {
    text = text.replace(/-/g, separator);
  }

  return text ? text : 'a';
};

export const adapterQueryHotel = (formData: some = {}, paging: some = {}) => {
  let result: some = {};
  let filtersTemp: some = { ...formData, removeTest: false };
  delete filtersTemp.filedAdds;
  if (!isEmpty(formData?.createdDate)) {
    filtersTemp = {
      ...filtersTemp,
      createdFromDate: formData.createdDate.createdFromDate,
      createdToDate: formData.createdDate.createdToDate,
    };
    delete filtersTemp.createdDate;
  }
  if (!isEmpty(formData?.checkIn)) {
    filtersTemp = {
      ...filtersTemp,
      checkinFromDate: formData.checkIn.checkinFromDate,
      checkinToDate: formData.checkIn.checkinToDate,
    };
    delete filtersTemp.checkIn;
  }
  if (!isEmpty(formData?.checkOut)) {
    filtersTemp = {
      ...filtersTemp,
      checkOutFromDate: formData.checkOut.checkOutFromDate,
      checkOutToDate: formData.checkOut.checkOutToDate,
    };
    delete filtersTemp.checkOut;
  }
  if (!isEmpty(formData?.paymentDate)) {
    filtersTemp = {
      ...filtersTemp,
      paymentFromDate: formData.paymentDate.paymentFromDate,
      paymentToDate: formData.paymentDate.paymentToDate,
    };
    delete filtersTemp.paymentDate;
  }
  if (!isEmpty(formData?.others)) {
    formData?.others?.forEach((el: string) => {
      filtersTemp = {
        ...filtersTemp,
        [el]: true,
      };
    });
    delete filtersTemp.others;
  }
  result = {
    filters: filtersTemp,
    paging,
  };
  return result;
};

export const removeFieldEmptyFilterHotel = (formData: some = {}) => {
  let result: some = {};
  if (!isEmpty(formData?.createdDate)) {
    formData = {
      ...formData,
      createdFromDate: formData.createdDate.createdFromDate,
      createdToDate: formData.createdDate.createdToDate,
    };
    delete formData.createdDate;
  }
  if (!isEmpty(formData?.checkIn)) {
    formData = {
      ...formData,
      checkinFromDate: formData.checkIn.checkinFromDate,
      checkinToDate: formData.checkIn.checkinToDate,
    };
    delete formData.checkIn;
  }
  if (!isEmpty(formData?.checkOut)) {
    formData = {
      ...formData,
      checkOutFromDate: formData.checkOut.checkOutFromDate,
      checkOutToDate: formData.checkOut.checkOutToDate,
    };
    delete formData.checkOut;
  }
  if (!isEmpty(formData?.paymentDate)) {
    formData = {
      ...formData,
      paymentFromDate: formData.paymentDate.paymentFromDate,
      paymentToDate: formData.paymentDate.paymentToDate,
    };
    delete formData.paymentDate;
  }
  const keyNames = Object.keys(formData);
  keyNames.forEach((el) => {
    if (!isEmpty(formData[el])) {
      result = {
        ...result,
        [el]: Array.isArray(formData[el]) ? formData[el].join(',') : formData[el],
      };
    }
  });
  return result;
};

export const getPaymentStatusPaymentAriseHotel = (
  paymentStatus: any,
  paymentMethodCode: string,
) => {
  switch (paymentStatus) {
    case 'pending': {
      if (paymentMethodCode === 'CD') {
        return {
          title: 'Đang giữ',
          color: '#FFB30F',
          backGround: '#FFFAEE',
          detailTitle: 'Đang giữ',
        };
      } else {
        return {
          title: 'Đang chờ thanh toán',
          color: '#FFB30F',
          backGround: '#FFFAEE',
          detailTitle: 'Đang chờ thanh toán',
        };
      }
    }
    case 'failed':
      return {
        title: 'Đã hủy',
        color: '#FF2C00',
        backGround: '#FFF0ED',
        detailTitle: 'Đã hủy',
      };
    case 'success':
      return {
        title: 'Thanh toán thành công',
        color: '#007864',
        backGround: '#E9FCEE',
        detailTitle: 'Thanh toán thành công',
      };
    default:
      return {
        title: 'Chưa đặt vé',
        color: '#FFB30F',
        backGround: '#FFFAEE',
        detailTitle: 'Chưa đặt vé',
      };
  }
};

export const getStatusVoidProcessing = (bookStatus: any) => {
  switch (bookStatus) {
    case 'approved':
      return {
        title: 'Phê duyệt',
        color: '#007864',
        class: 'success',
      };
    case 'pending':
      return {
        title: 'Chờ duyệt',
        color: '#FFB30F',
        class: 'warning',
      };
    case 'rejected':
      return {
        title: 'Từ chối',
        color: '#FF2C00',
        class: 'error',
      };
    default:
      return {
        title: 'Chưa gửi yêu cầu',
        color: '#FFB30F',
        class: 'warning',
      };
  }
};

export const getPaymentStatusPSTFlight = (paymentStatus: any) => {
  switch (paymentStatus) {
    case 'holding':
      return {
        title: 'Đang giữ tiền',
        color: '#FFB30F',
        detailTitle: 'Đang giữ tiền',
        backGround: '#FFFAEE',
        class: 'processing',
      };
    case 'awaiting-payment':
    case 'awaiting_payment':
      return {
        title: 'Chờ thanh toán',
        color: '#FFB30F',
        detailTitle: 'Chờ thanh toán',
        backGround: '#FFFAEE',
        class: 'warning',
      };
    case 'completed':
      return {
        title: 'Đã thanh toán',
        color: '#007864',
        detailTitle: 'Đã thanh toán',
        backGround: '#FFFAEE',
        class: 'success',
      };
    case 'rejected':
      return {
        title: 'Từ chối',
        color: '#FF2C00',
        detailTitle: 'Từ chối',
        backGround: '#FFF0ED',
        class: 'error',
      };
    case 'cancelled':
      return {
        title: 'Đã hủy',
        color: '#FF2C00',
        detailTitle: 'Đã hủy',
        backGround: '#FFF0ED',
        class: 'error',
      };
    case 'failed':
      return {
        title: 'Thanh toán thất bại',
        color: '#FF2C00',
        detailTitle: 'Thanh toán thất bại',
        backGround: '#FFF0ED',
        class: 'error',
      };
    case 'success':
      return {
        title: 'Thanh toán thành công',
        color: '#007864',
        detailTitle: 'Thanh toán thành công',
        backGround: '#FFFAEE',
        class: 'success',
      };
    default:
      return {
        title: 'Chưa đặt vé',
        color: '#FFB30F',
        detailTitle: 'Chưa đặt vé',
        backGround: '#FFFAEE',
        class: 'processing',
      };
  }
};

// trạng thái chuyển khoản ngân hàng

export const getListstatusTransfer = (status: any) => {
  switch (status) {
    case 'SUCCESS':
      return {
        title: 'Thành công',
        color: '#007864',
      };
    case 'ERROR':
      return {
        title: 'Lỗi',
        color: '#FF2C00',
      };
    case 'EXPIRED':
      return {
        title: 'Hết hạn',
        color: '#FF2C00',
      };
    case 'NEED_TO_CHECK':
      return {
        title: 'Cần kiểm tra',
        color: '#FFB30F',
      };
    case 'IGNORED':
      return {
        title: 'Chờ xử lý',
        color: '#FFB30F',
      };

    default:
      return {
        title: 'Chưa xử lý',
        color: '#FFB30F',
      };
  }
};

export const genSignIn = (airlineCode: string) => {
  let result: string | undefined = undefined;
  switch (airlineCode) {
    case 'VN':
    case 'VJ':
    case 'QH':
    case 'VU':
      result = 'Tripi';
      break;
    case 'VJR':
    case 'QHR':
      result = 'Vntravel';
      break;
    case '1G':
      result = 'Biển Đông (ES)';
      break;
    case '1A':
      result = 'TranViet';
      break;
    case 'KWR':
      result = 'KIWI';
      break;
    case 'VJM':
      result = 'Vietjet MyTour';
      break;
  }
  return result;
};

export const getPaymentStatusVoidProcessing = (paymentStatus: any) => {
  switch (paymentStatus) {
    case 'success':
      return {
        title: 'Thành công',
        color: '#007864',
        class: 'success',
      };
    case 'awaiting-payment':
    case 'pending':
      return {
        title: 'Chờ thanh toán',
        color: '#FFB30F',
        class: 'warning',
      };
    case 'refunded':
      return {
        title: 'Thất bại',
        color: '#FF2C00',
        class: 'error',
      };
    case 'rejected':
      return {
        title: 'Bị từ chối',
        color: '#FF2C00',
        class: 'error',
      };
    default:
      return {
        title: paymentStatus,
        color: '#FFB30F',
        class: 'warning',
      };
  }
};

export const adapterQueryReconlition = (formData: some = {}, paging: some = {}) => {
  let result: some = {};
  let filtersTemp: some = { ...formData };
  delete filtersTemp.filedAdds;
  if (!isEmpty(formData?.reconcileDate)) {
    filtersTemp = {
      ...filtersTemp,
      reconcileDateFrom: moment(formData.reconcileDate.reconcileDateFrom, 'DD-MM-YYYY').format(
        'YYYY-MM-DD',
      ),
      reconcileDateTo: moment(formData.reconcileDate.reconcileDateTo, 'DD-MM-YYYY').format(
        'YYYY-MM-DD',
      ),
    };
    delete filtersTemp.reconcileDate;
  }
  if (!isEmpty(formData?.others)) {
    formData?.others?.forEach((el: string) => {
      filtersTemp = {
        ...filtersTemp,
        [el]: true,
      };
    });
    delete filtersTemp.others;
  }
  if (!isEmpty(filtersTemp.caIds)) {
    filtersTemp = {
      ...filtersTemp,
      caIds: filtersTemp.caIds.join(','),
    };
  }
  if (!isEmpty(filtersTemp.statuses)) {
    filtersTemp = {
      ...filtersTemp,
      statuses: filtersTemp.statuses.join(','),
    };
  }
  if (!isEmpty(filtersTemp.errorTagIds)) {
    filtersTemp = {
      ...filtersTemp,
      errorTagIds: filtersTemp.errorTagIds.join(','),
    };
  }
  if (!isEmpty(filtersTemp.errorTags)) {
    filtersTemp = {
      ...filtersTemp,
      errorTags: filtersTemp.errorTags.join(','),
    };
  }
  if (!isEmpty(filtersTemp.solutionIds)) {
    filtersTemp = {
      ...filtersTemp,
      solutionIds: filtersTemp.solutionIds.join(','),
    };
  }
  if (!isEmpty(filtersTemp.departments)) {
    filtersTemp = {
      ...filtersTemp,
      departments: filtersTemp.departments.join(','),
    };
  }
  if (!isEmpty(filtersTemp.matchingTypes)) {
    filtersTemp = {
      ...filtersTemp,
      matchingTypes: filtersTemp.matchingTypes === true ? 'MATCHING_PARTIALLY' : undefined,
    };
  }
  result = {
    ...filtersTemp,
    ...paging,
    page: paging.page - 1,
  };
  return result;
};
