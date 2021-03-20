import { memo } from "react";
import { Route, Redirect } from 'react-router-dom';

function ProtectedRoute(props) {
  return (
    <Route path={props.path}>
      {props.isLoggedIn ? props.children : <Redirect to="/sign-in" />}
    </Route>
  )
}

export default memo(ProtectedRoute)
