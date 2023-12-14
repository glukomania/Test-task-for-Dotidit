
const moment = require('moment');

const getDate = (isoDateString:string) => {
  const startDate = moment(isoDateString);
  const currentDate = moment();

  const duration = moment.duration(currentDate.diff(startDate));

  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const durationString:string = `${days} days, ${hours} hours, ${minutes} minutes ago`;

  return durationString;
}


export default getDate