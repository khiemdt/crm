export const MODAL_KEY_SMS = 'SMS';
export const MODAL_KEY_EMAIL = 'EMAIL';
export const MODAL_KEY_EDIT_BOOKER = 'EDIT_BOOKER';

export const MODAL_KEY_MENU = {
  EDIT_CHANGE_ACTION: 'EDIT_CHANGE_ACTION',
  SPLIT_CODE: 'SPLIT_CODE',
  VOID_TICKET: 'VOID_TICKET',
  PAYMENT_REQUEST: 'PAYMENT_REQUEST',
  ISSUE_TICKET: 'ISSUE_TICKET',
  VOID_TICKET_PNR: 'VOID_TICKET_PNR',
  HOLD_TICKET: 'HOLD_TICKET',
  EDIT_NOTE: 'EDIT_NOTE',
  UPLOAD_FILE: 'UPLOAD_FILE',
  UPLOAD_FILE_EXCEL: 'UPLOAD_FILE_EXCEL',
  UPDATE_BOOKING_PNR_BEFORE: 'UPDATE_BOOKING_PNR_BEFORE',
  UPDATE_BOOKING_PNR: 'UPDATE_BOOKING_PNR',
  UPLOAD_DETAIL_GUESTS: 'UPLOAD_DETAIL_GUESTS',
  CHANGE_CUSTOMER: 'CHANGE_CUSTOMER',
};

export const TYPE_TICKET_INFO = {
  DEPARTURE: 'DEPARTURE',
  RETURN: 'RETURN',
};

export const API_KEY_TINY = 'uqcdcebnur9ecbyxhrt6jub18nqydv59mgy9mh755krqy3bm';
export const RULES_REGEXP_EMAIL = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
export const RULES_REGEXP_PHONE = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
export const DATE_TIME = 'DD-MM-YYYY HH:mm';
export const SIZE_SECTION_ASSIGNEE = 10;
export const SETTING_INIT_TINY = {
  height: 400,
  menubar: true,
  plugins: ['image', 'code', 'table', 'link', 'media', 'codesample', 'fullscreen'],
  toolbar: [
    'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | media | table |fullscreen',
  ],
  inline_styles: true,
  keep_styles: true,
  valid_children: '+html[head],+html[body],+body[style]',
  valid_elements: '*[*]',
};
export const SETTING_INIT_CKEDITOR = {
  language: 'vi',
  allowedContent: true,
  entities: false,
  height: 300,
  fullPage: true,
  image_previewText: 'Xem trước ảnh',
  toolbarGroups: [
    { name: 'document', groups: ['mode', 'document', 'doctools'] },
    { name: 'clipboard', groups: ['clipboard', 'undo'] },
    { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
    { name: 'forms', groups: ['forms'] },
    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
    { name: 'paragraph', groups: ['list', 'indent', 'align', 'bidi', 'paragraph'] },
    { name: 'links', groups: ['links'] },
    { name: 'insert', groups: ['insert'] },
    '/',
    { name: 'styles', groups: ['styles'] },
    { name: 'colors', groups: ['colors'] },
    { name: 'tools', groups: ['tools'] },
    { name: 'others', groups: ['others'] },
    { name: 'about', groups: ['about'] },
  ],
  removeButtons:
    'Print,Preview,NewPage,Save,Templates,PasteText,Undo,Redo,Replace,Find,Scayt,SelectAll,Form,TextField,Checkbox,Radio,Textarea,Select,Button,ImageButton,HiddenField,BidiLtr,BidiRtl,Language,Anchor,Flash,HorizontalRule,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About',
};
export const FORMAT_TIME = 'HH:mm';
export const FORMAT_DATE = 'DD/MM/YYYY';
export const FORMAT_DATE_BACKEND = 'DD-MM-YYYY';
export const FORMAT_TIME_BACKEND = 'HH:mm';
export const FORMAT_DAYS = [
  'Chủ nhật',
  'Thứ hai',
  'Thứ ba',
  'Thứ tư',
  'Thứ năm',
  'Thứ sáu',
  'Thứ bảy',
];
export const DEFAULT_PAGING = { page: 1, pageSize: 10 };
export const SUCCESS_CODE = 200;

export const OPTION_PNR_STATUS = [
  {
    code: 'voided',
    name: 'Đã hủy',
  },
  {
    code: 'confirmed',
    name: 'Đã xác nhận',
  },
  {
    code: 'holding',
    name: 'Chờ xác nhận',
  },
];

export const OPTION_FIGHT_TICKET = {
  OUTBOUND: 'OUTBOUND',
  INBOUND: 'INBOUND',
};

export const getLocationHref = () => {
  switch (window.location.host) {
    case 'premium-crm-dev.tripi.vn':
      return 'dev';
    case 'premium-crm.tripi.vn':
    case 'premium-crm-stage.tripi.vn':
      return 'prod';
    default:
      return 'dev';
  }
};

export const MODAL_CONTACT_INFO = {
  EDIT_BOOKER: 'EDIT_BOOKER',
  LIST_TRANSFERS: 'LIST_TRANSFERS',
};

export const LIST_STATUS_TRANSFER = [
  {
    name: 'Thành công',
    id: 'SUCCESS',
    color: '#28a745',
  },
  {
    name: 'Lỗi',
    id: 'ERROR',
    color: '#bd2130',
  },
  {
    name: 'Hết hạn',
    id: 'EXPIRED',
    color: '#6c757d',
  },
  {
    name: 'Cần kiểm tra',
    id: 'NEED_TO_CHECK',
    color: '#ffc107',
  },
  {
    name: 'Chờ xử lý',
    id: 'IGNORED',
    color: '#007bff',
  },
];

export const TASK_TYPES = {
  CHANGE_ITINERARY: 'CHANGE_ITINERARY',
  DIVIDE_BOOKING: 'divide_booking',
  ADD_BAGGAGE: 'ADD_BAGGAGE',
};
