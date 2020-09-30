import moment from 'moment';

export const floor = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const getFirstDayOfLastMonth = () => {

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1 > 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1);
  const firstDayOfMonth = moment(`${currentYear}-${currentMonth}-01`);

  return firstDayOfMonth.subtract(1, 'months');
}


const getToday = () => {
  const today = moment();

  return today;
}


export default {
  namespace: 'list',
  state: {
    "floor": floor[0],
    "time": [getFirstDayOfLastMonth(), getToday()]
  },
  reducers: {
    'set'(state, { payload }) {
      return { ...state, ...payload }
    },
  },
};
