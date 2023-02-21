import { some } from '~/utils/constants/constant';

export interface BookingsOnlineType {
  orderCode: string;
  caInfo: some;
  id: number;
}

export interface PagingOnline {
  page: number;
  pageSize: number;
}

export interface InvoiceFlightType {
  id: number;
  status: string;
  items: [];
}
