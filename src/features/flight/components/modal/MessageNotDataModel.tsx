
const MessageNotDataModel = () => {
  return (
    <div className='wrapper-message-model-sms'>
      <div className='content-message-model-sms'>
        <p>
          Vé máy bay của khách hàng chưa được đặt thành công. Vui lòng sử dụng chức năng "Đặt lại
          vé" hoặc thực hiện đặt vé bằng tay.
        </p>
        <p>
          Mã đặt vé: <span className='errorText'> Chưa có</span>
        </p>
      </div>
    </div>
  );
};

export default MessageNotDataModel;
