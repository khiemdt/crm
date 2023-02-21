import { CRM_SERVICE } from "~/utils/constants/constant";
import api from "~/utils/helpers/api";

export const getFlightRefundBookings = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/getPreviewRefundRequest',
    data,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const createFlightRefundBookings = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/editFlightPostProcessing',
    data,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const actionFlightRefundBookings = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/handlePreviewRefundRequest',
    data,
    serVice: CRM_SERVICE,
  };
  return api(option);
};