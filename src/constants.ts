export const PRO_REQUEST_URL = location.protocol + `//api.${window.location.host.split('.').slice(1).join('.')}`;

export const PRO_RESOURCE_URL = `//file.${window.location.host.split('.').slice(1).join('.')}/`;

export const environment = {
  production: false,
  REQUEST_URL: location.host.includes('localhost') ? location.protocol + '//localhost:18888' : PRO_REQUEST_URL,
  RESOURCE_URL: PRO_RESOURCE_URL,
};

export const dateFormatShow = 'YYYY年MM月DD日';
export const dateTimeFormatShow = 'YYYY年MM月DD日 hh:mm:ss';


export let room_list: any = [];
[1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(i => {
  const b = i * 100;
  for (let index = 1; index <= 18; index++) {
    room_list.push(b + index);
  }
});


export const useDetailColumns = [
  {
    key: 'electric_meter_reading_last_month', dataIndex: 'electric_meter_reading_last_month', title: '电表上月读数',
  },
  {
    key: 'electric_meter_reading_this_month', dataIndex: 'electric_meter_reading_this_month', title: '电表本月读数',
  },
  {
    key: 'hot_water_meter_reading_last_month', dataIndex: 'hot_water_meter_reading_last_month', title: '热水水表上月读数',
  },
  {
    key: 'hot_water_meter_reading_this_month', dataIndex: 'hot_water_meter_reading_this_month', title: '热水水表本月读数',
  },
  {
    key: 'cold_water_meter_reading_last_month', dataIndex: 'cold_water_meter_reading_last_month', title: '冷水水表上月读数',
  },
  {
    key: 'cold_water_meter_reading_this_month', dataIndex: 'cold_water_meter_reading_this_month', title: '冷水水表本月读数',
  },];