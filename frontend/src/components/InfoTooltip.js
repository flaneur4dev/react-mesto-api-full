import { memo } from 'react';
import { closeByOverlay } from '../utils/utils';
import { useEscapeClose } from '../hooks/useEscapeClose';
import fail from '../images/auth/fail.svg';
import success from '../images/auth/success.svg';

function InfoTooltip({ info, onClose }) {
  const { isOpen, message } = info;

  useEscapeClose(isOpen, onClose);
  const handleOverlayClose = closeByOverlay(onClose);

  const picture = message === 'Вы успешно зарегистрировались!' ? success : fail;

  return (
    <section
      className={`popup ${isOpen ? 'popup_opened' : ''}`}
      onMouseDown={handleOverlayClose}
    >
      <div className="popup__container popup__container_type_info">
        <img className="popup__pic" src={picture} alt="Картинка авторизации" />
        <p className="popup__info">{message}</p>
        <button
          className="popup__button popup__button_type_close-button"
          type="button"
          name="close-button"
          onClick={onClose}
        />
      </div>
    </section>
  )
}

export default memo(InfoTooltip)
