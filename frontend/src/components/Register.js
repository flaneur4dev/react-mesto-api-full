import { memo } from "react";
import { Link } from "react-router-dom";
import AuthForm from "./AuthForm";

function Register(props) {
  return (
    <section className="auth">
      <h2 className="auth__title">Регистрация</h2>
      <AuthForm
        submitButton="Зарегистрироваться"
        isDisabled={props.isDisabled}
        errors={props.errors}
        handleChange={props.handleChange}
        onSubmit={props.onRegister}
      />
      <footer className="auth__footer">
        <span className="auth__footer-ask">Уже зарегистрированы?</span>
        <Link className="page__link" to="/sign-in">Войти</Link>
      </footer>
    </section>
  )
}

export default memo(Register)
