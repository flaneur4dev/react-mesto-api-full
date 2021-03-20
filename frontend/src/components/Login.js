import { memo } from "react";
import AuthForm from "./AuthForm";

function Login(props) {
  return (
    <section className="auth">
      <h2 className="auth__title">Вход</h2>
      <AuthForm
        submitButton="Войти"
        isDisabled={props.isDisabled}
        errors={props.errors}
        handleChange={props.handleChange}
        onSubmit={props.onLogin}
      />
    </section>
  )
}

export default memo(Login)
