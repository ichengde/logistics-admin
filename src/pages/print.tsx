import React, { useState, useEffect } from 'react';
import styles from './print.less';
import request from '@/request';
import Detail from '@/component/detail';
import { dateFormatShow } from '@/constants';
import moment from 'moment';
import { Button } from 'antd';

export default (props) => {
  const { params } = props.match;
  let { id } = params;
  const [dataList, setDataList]: [any, any] = useState([]);
  if (id.indexOf('-') > 0) {
    id = id.split('-');
  } else {
    id = [id];
    console.log(id);
  }

  useEffect(() => {
    Promise.all(id.map((d =>
      request.get('apartment/detail/' + d)
    ))).then((allRes) => {
      const l = allRes.map((res: any) => {
        const { data } = res;
        data.mId = `${moment(data.checkInTime).valueOf()}-${moment(data.checkOutTime).valueOf()}`;
        data.checkInTime = moment(data.checkInTime).format(dateFormatShow);
        data.checkOutTime = moment(data.checkOutTime).format(dateFormatShow);

        return data;
      })

      setDataList(l);

    }).catch((err) => console.log(err));

  }, [])

  return (
    <div>

      <Button className={styles.noPrint} type="primary" onClick={() => { window.print(); }}>打印</Button>
      {dataList.map((d: any) => {
        return <div key={d.mId}>
          <Detail content={d}></Detail>
          <Detail content={d}></Detail>
        </div>
      })}
    </div>
  );
}
