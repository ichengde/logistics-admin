import React from 'react';
import styles from './detail.less';
const Detail = ({ content }) => {
  const detail: any = content;
  if (!content) {
    return <div></div>;
  }

  return (
    <div className={`${styles['center']} ${styles['the-detail']}`}>
      <table className={`${styles['print-table']} ${styles['table']}`} >
        <tbody>
          <tr>
            <td className={styles['td']} colSpan={6}>
              爱尚公寓房租单
                </td>
          </tr>

          <tr>
            <td className={`${styles['font-left']} ${styles['td']}`} colSpan={5} >
              房号: {detail.room_number}
            </td>

            {/*  */}
            {detail.month && <td className={styles['td']} colSpan={1}>
              2019年{detail.month}月份
                </td>}


            {(!detail.month && detail.checkInTime) && <td className={styles['td']} colSpan={1}>
              {detail.checkInTime} 至 {detail.checkOutTime}
            </td>}
          </tr>

          <tr>
            <td className={styles['td']}>项目名称</td>
            <td className={styles['td']}>上月读数</td>
            <td className={styles['td']}>本月读数</td>
            <td className={styles['td']}>实用读数</td>
            <td className={styles['td']}>计费单价</td>
            <td className={styles['td']}>本月费用</td>
          </tr>

          <tr>
            <td className={styles['td']}>房租</td>
            <td className={styles['td']}></td>
            <td className={styles['td']}></td>
            <td className={styles['td']}></td>
            <td className={styles['td']}></td>
            <td className={styles['td']}>{detail.rent}</td>
          </tr>

          <tr>
            <td className={styles['td']}>冷水费</td>
            <td className={styles['td']}>{detail.cold_water_meter_reading_last_month}</td>
            <td className={styles['td']}>{detail.cold_water_meter_reading_this_month}</td>
            <td className={styles['td']}>{detail.total_cold_water_used}</td>
            <td className={styles['td']}>{detail.cold_water_unit_price}/m³</td>
            <td className={styles['td']}>{detail.total_cold_water_charge}</td>
          </tr>

          <tr>
            <td className={styles['td']}>热水费</td>
            <td className={styles['td']}>{detail.hot_water_meter_reading_last_month}</td>
            <td className={styles['td']}>{detail.hot_water_meter_reading_this_month}</td>
            <td className={styles['td']}>{detail.total_hot_water_used}</td>
            <td className={styles['td']}>{detail.hot_water_unit_price}/m³</td>
            <td className={styles['td']}>{detail.total_hot_water_charge}</td>
          </tr>
          <tr>
            <td className={styles['td']}>电费</td>
            <td className={styles['td']}>{detail.electric_meter_reading_last_month}</td>
            <td className={styles['td']}>{detail.electric_meter_reading_this_month}</td>
            <td className={styles['td']}>{detail.total_electric_used}</td>
            <td className={styles['td']}>{detail.electric_unit_price}/kW·h</td>
            <td className={styles['td']}>{detail.total_electric_charge}</td>
          </tr>

          <tr>
            <td className={styles['td']}>卫生费</td>
            <td className={styles['td']}></td>
            <td className={styles['td']}></td>
            <td className={styles['td']}></td>
            <td className={styles['td']}></td>
            <td className={styles['td']}>{detail.clean_fee}</td>
          </tr>

          <tr>
            <td className={`${styles['td']} ${styles['tdNoWrap']}`}>人民币大写(元)</td>
            <td className={styles['td']}>{detail.capitalFormOfAmount}</td>
            <td className={styles['td']}></td>
            <td className={styles['td']}></td>
            <td className={styles['td']}>小写(元)</td>
            <td className={styles['td']}>{detail.amount}</td>
          </tr>

          {detail.remark && <tr >
            <td className={styles['td']}>备注</td>
            <td className={styles['td']} colSpan={5}>{detail.remark}</td>
          </tr >
          }
        </tbody >
      </table >
    </div >
  );
}
export default Detail;
