import { message } from 'antd';
import { history } from 'umi';
import { extend } from 'umi-request';
import { environment } from './constants';
/* https://umijs.org/zh-CN/plugins/plugin-request */

const myRequest = extend({
  prefix: environment.REQUEST_URL,
  errorHandler: (error) => {
    console.log(error.data);
    if (error?.data?.trace) {
      message.error(error.data.trace)
    }

    if (error?.data?.msg) {
      message.error(error.data.msg)
    }


    if (error?.data?.code === 401) {
      history.push('/login');
    }

    throw error; // 如果throw. 错误将继续抛出.
  }
});

myRequest.use(async (ctx, next) => {
  const token = sessionStorage.getItem('token');

  if (token) {
    ctx.req.options.headers = {
      'token': token,
    }
  }

  await next();

});

export default myRequest