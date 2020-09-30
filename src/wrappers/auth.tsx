import { Redirect } from 'umi'
import React from 'react';
export default (props) => {
  let isLogin = false;
  if (sessionStorage.getItem('token')) {
    isLogin = true;
  }

  if (isLogin) {
    return <div>{props.children} </div>;
  } else {
    return <Redirect to="/login" />;
  }
}