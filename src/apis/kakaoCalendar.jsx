const calendarApi = {
  create: async (data, latLng) => {
    const startDate = (timeString) => {
      let time = new Date(timeString);
      let minutes = time.getMinutes();
      let roundedMinutes = Math.ceil(minutes / 5) * 5;
      if (roundedMinutes >= 60) {
        time.setHours(time.getHours() + 1);
        roundedMinutes = 0;
      }
      time.setMinutes(roundedMinutes);
      const formattedTime = time.toISOString().slice(0, 16);
      return formattedTime;
    };
    const endDate = (timeString, matchtime) => {
      let time = new Date(timeString);
      let minutes = time.getMinutes();
      let roundedMinutes = Math.ceil(minutes / 5) * 5;
      if (roundedMinutes >= 60) {
        time.setHours(time.getHours() + 1);
        roundedMinutes = 0;
      }
      let hours = time.getHours();
      let endHours = hours + matchtime;
      if (endHours >= 24) {
        time.setDate(time.getDate() + 1);
        endHours = endHours - 24;
      }
      time.setMinutes(roundedMinutes);
      time.setHours(endHours);
      const formattedTime = time.toISOString().slice(0, 16);
      return formattedTime;
    };

    const start_at = startDate(data.schedule);
    const end_at = endDate(data.schedule, data.matchtime);

    const queryString = new URLSearchParams({
      channel_public_id: '_ZBlkG',
      event: JSON.stringify({
        title: data.title,
        time: {
          start_at: start_at,
          end_at: end_at,
          time_zone: 'Asia/Seoul',
        },
        description: `
${data.info}

멤버들과 사전에 소통하려면 길농 단톡에 참여해주세요!

https://open.kakao.com/o/gIvCS6pg
        `,
        location: {
          name: data.buildingname,
          address: data.location,
          latitude: latLng.lat,
          longitude: latLng.lng,
        },
        reminders: [10, 60],
        notification_message: {
          before_event_reminder: {
            button: {
              title: '상세보기',
              link: {
                web_url: `https://gilnong.com/detail?id=${data.id}`,
              },
            },
          },
        },
      }),
    }).toString();

    try {
      const response = await fetch(
        'https://kapi.kakao.com/v2/api/calendar/public/create/event',
        {
          method: 'POST',
          headers: {
            Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_ADMIN_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: queryString,
        }
      );
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error:', error);
      throw error; // 에러가 발생하면 예외를 throw하여 호출자에게 알림
    }
  },
  add: async (eventId, atToken) => {
    const queryString = new URLSearchParams({
      event_id: eventId,
    }).toString();

    try {
      const response = await fetch(
        'https://kapi.kakao.com/v2/api/calendar/public/follow',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${atToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: queryString,
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      return responseData;
    } catch (error) {
      console.error('Error:', error);
      throw error; // 에러가 발생하면 예외를 throw하여 호출자에게 알림
    }
  },
};

export default calendarApi;
