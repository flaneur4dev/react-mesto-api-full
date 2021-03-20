import { memo, useContext } from 'react';
import { CurrentUserContext } from '../context/CurrentUserContext';

function Account(props) {
  const { email } = useContext(CurrentUserContext);

  return (
    <article className={`${props.isMobile ? 'account-m' : 'account'} ${props.isOpen ? 'account-m_open' : ''}`}>
      <span className="account__email">{email}</span>
      <button className="account__button" type="button" onClick={props.onSignOut}>Выйти</button>
    </article>
  )
}

export default memo(Account)
