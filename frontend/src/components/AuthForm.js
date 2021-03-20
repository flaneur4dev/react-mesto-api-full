import { memo, useState } from "react";

function AuthForm(props) {
  const [inputValue, setInputValue] = useState({});

  function handleInputChange({ target }) {
    setInputValue(prevState => ({ ...prevState, [target.name]: target.value }));
    props.handleChange(target)
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.onSubmit(inputValue)
  }

  return (
    <form className="auth__form" id="auth-form" name="auth-form" onSubmit={handleSubmit} noValidate>
      <fieldset className="auth__wrapper">
        <input
          type="email"
          className="auth__input"
          id="email"
          name="email"
          placeholder="Email"
          pattern="^[\w.-]{2,}@([\w-]{2,}\.)+[\w-]{2,}"
          required
          value={inputValue.email || ''}
          onChange={handleInputChange}
        />
        <span className="popup__input-error">{inputValue.email ? props.errors.email : ''}</span>
        <input
          type="password"
          className="auth__input"
          id="password"
          name="password"
          placeholder="Пароль"
          pattern="^\w{6,12}"
          required
          value={inputValue.password || ''}
          onChange={handleInputChange}
        />
        <span className="popup__input-error">{inputValue.password ? props.errors.password : ''}</span>
      </fieldset>
      <button className="auth__button" type="submit" disabled={props.isDisabled}>{props.submitButton}</button>
    </form>
  )
}

export default memo(AuthForm)
