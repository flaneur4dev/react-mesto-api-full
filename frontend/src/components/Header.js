import { memo, useState } from 'react';
import { useLocation, Link } from "react-router-dom";
import Account from './Account';
import logo from '../images/header/Logo_vector.svg';

function Header({ isLoggedIn, ...props }) {
  const { pathname } = useLocation();

  const [isAccountOpen, setIsAccountOpen] = useState(false);

  function handleClick() {
    setIsAccountOpen(prevState => !prevState)
  }

  return (
    <header className="page__section">
      {isLoggedIn && <Account isMobile={true} isOpen={isAccountOpen} {...props} />}
      <section className="header">
        <Link to="/">
          <img src={logo} alt="Логотип" className="header__logo" />
        </Link>
        {isLoggedIn
          ? <>
              <Account {...props} />
              <div className="burger" onClick={handleClick}>
                <div className={`burger__line ${isAccountOpen ? 'burger__line_open' : ''}`} />
                <div className={`burger__line ${isAccountOpen ? 'burger__line_open' : ''}`} />
                <div className={`burger__line ${isAccountOpen ? 'burger__line_open' : ''}`} />
              </div>
            </>
          : <Link className="page__link" to={pathname === '/sign-in' ? '/sign-up' : '/sign-in'}>
              {pathname === '/sign-in' ? 'Регистрация' : 'Войти'}
            </Link>
        }
      </section>
    </header>
  )
}

export default memo(Header)
