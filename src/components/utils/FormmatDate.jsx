import React from 'react';

const FormmatDate = (data) => {
  const date = new Date(data);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  const ampm = hour >= 12 ? '오후' : '오전';
  const hour12 = hour % 12 || 12;

  const formattedDate = `${month}/${day}(${getWeekday(
    date
  )}) ${ampm} ${hour12}시 ${minute}분`;

  function getWeekday(date) {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return weekdays[date.getDay()];
  }

  return formattedDate;
};

export default FormmatDate;
