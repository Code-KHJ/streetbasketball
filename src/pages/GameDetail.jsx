import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useSupabase from '@/apis/useSupabase';
import { useUser } from '@/contexts/UserContext';
import styles from './pages.module.scss';
import FormmatDate from '@/components/utils/FormmatDate';
import KakaoMapLatLng from '@/components/utils/KakaoMapLatLng';
import GetKakaoMap from '@/components/utils/GetKakaoMap';
import calendarApi from '@/apis/kakaoCalendar';

const GameDetail = () => {
  const supabase = useSupabase();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const queryString = location.search;
  const keyValuePairs = queryString.substring(1).split('&');
  const keyValueObject = {};
  keyValuePairs.forEach((pair) => {
    const [key, value] = pair.split('=');
    keyValueObject[key] = value;
  });

  const [values, setValues] = useState({
    organizer: '',
    title: '',
    schedule: '',
    versus: '',
    info: '',
    location: '',
    buildingname: '',
    member: { member: [], withball: [] },
    minimum: '',
    maximum: '',
    matchtime: '',
    status: '',
    calendar_id: '',
  });

  useEffect(() => {
    if (supabase) {
      const getGame = async () => {
        try {
          const { data: Games, error } = await supabase
            .from('Games')
            .select('*')
            .eq('id', keyValueObject['id']);

          if (Games.length < 1) {
            navigate('/error');
          }
          setValues(Games[0]);
        } catch (error) {
          console.error('Error', error.message);
          alert('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      };
      getGame();
    }
  }, [supabase]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const latLngResult = KakaoMapLatLng({ searchPlace: values.location });

  const copyLocation = () => {
    navigator.clipboard
      .writeText(values.location)
      .then(() => {
        alert('주소가 복사되었습니다.');
      })
      .catch((error) => {
        alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      });
  };

  const [checkList, setCheckList] = useState({
    read: '',
    manner: '',
    ball: '',
  });
  const [checkListRed, setCheckListRed] = useState({
    read: false,
    manner: false,
    ball: false,
  });
  const handleChangeCheckList = (e) => {
    setCheckList({
      ...checkList,
      [e.target.name]: e.target.value,
    });
    if (e.target.value === 'y') {
      setCheckListRed({
        ...checkListRed,
        [e.target.name]: false,
      });
    }
    if (e.target.name === 'ball') {
      setCheckListRed({
        ...checkListRed,
        [e.target.name]: false,
      });
    }
  };

  const [isDisabled, setIsDisabled] = useState({
    status: false,
    text: '신청하기',
  });
  const isUserMember = values.member.member.includes(user.id);
  useEffect(() => {
    switch (values.status) {
      case 'closed':
        setIsDisabled({
          status: true,
          text: '모집종료',
        });
        break;
      case 'done':
        setIsDisabled({
          status: true,
          text: '모집마감',
        });
        break;
      default:
        if (isUserMember) {
          setIsDisabled({
            status: true,
            text: '신청완료',
          });
        } else {
          setIsDisabled({
            status: false,
            text: '신청하기',
          });
        }
        break;
    }
  }, [values.status, isUserMember]);

  const joinGame = async () => {
    if (!user.id) {
      alert('로그인 후 이용해주세요.');
      return;
    }
    if (checkList.read !== 'y') {
      setCheckListRed({
        ...checkListRed,
        read: true,
      });
      const element = document.getElementById('read');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (checkList.manner !== 'y') {
      setCheckListRed({
        ...checkListRed,
        manner: true,
      });
      const element = document.getElementById('manner');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (checkList.ball === '') {
      setCheckListRed({
        ...checkListRed,
        ball: true,
      });
      const element = document.getElementById('ball');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const userConfirm = window.confirm('매치에 참여하시겠습니까?');
    if (!userConfirm) {
      return;
    }

    if (!values.member.member.includes(user.id)) {
      values.member.member.push(user.id);
    }
    if (checkList.ball === 'y' && !values.member.withball.includes(user.id)) {
      values.member.withball.push(user.id);
    }

    try {
      const { data, error } = await supabase
        .from('Games')
        .update({ member: values.member })
        .eq('id', keyValueObject['id'])
        .select();

      if (error) {
        console.error('Error', error.message);
        alert('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        const addUser = await calendarApi.add(values.calendar_id, user.kakaoat);
        alert('신청되었습니다.');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error', error.message);
      alert('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };
  return (
    <div>
      <div className={styles.game_detail}>
        {values.title !== '' ? (
          <>
            <section className={styles.content_wrap}>
              <div className={styles.content}>
                <div className={styles.title}>
                  <h1>{values.title}</h1>
                  <div className={styles.location}>
                    <span>
                      {values.location} ({values.buildingname})
                    </span>
                    <span> | </span>
                    <span
                      className={styles.copy_location}
                      onClick={copyLocation}
                    >
                      주소 복사
                    </span>
                  </div>
                  <div className={styles.schedule}>
                    {FormmatDate(values.schedule)}
                  </div>
                  <div className={styles.members}>
                    현재인원: {values.member.member.length}명
                  </div>
                </div>
                <div className={styles.game_type}>
                  <h1>매치 방식</h1>
                  <div className={styles.types}>
                    <ul>
                      <li>
                        <img src="/images/court.png" alt="court icon" />
                        {values.versus}
                      </li>
                      <li>
                        <img src="/images/people.png" alt="people icon" />
                        {values.minimum}~{values.maximum}명
                      </li>
                      <li>
                        <img src="/images/hourglass.png" alt="hourglass icon" />
                        {values.matchtime}시간
                      </li>
                      {values.member.withball.length > 0 ? (
                        <li>
                          <img
                            src="/images/basketball_black.png"
                            alt="ball icon"
                          />
                          {values.member.withball.length}개 준비
                        </li>
                      ) : (
                        <li>
                          <img
                            src="/images/basketball_black.png"
                            alt="ball icon"
                          />
                          0개
                          <span style={{ margin: '0 10px' }}></span>
                          <span style={{ color: 'red', fontWeight: '600' }}>
                            공이 필요해요!
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className={styles.game_info}>
                  <h1>매치 안내</h1>
                  <div style={{ lineHeight: '20px' }}>{values.info}</div>
                </div>
                <div className={styles.manner}>
                  <h1>이것은 꼭 지켜주세요</h1>
                  <div className={styles.notice}>
                    <p>1. 즐거운 운동이 되도록 기본적인 매너를 지켜주세요.</p>
                    <p>
                      2. 운동시간 10분 전까지 코트에 오셔서 인사와 몸풀기로
                      준비해주세요.
                    </p>
                    <p>
                      3. 당일 인원 & 코트 상황에 따라 매치방식이 변경될 수
                      있습니다.
                    </p>
                    <p>
                      4. 사전 소통을 위해서 오픈채팅방에 꼭 미리 참가해주세요.
                    </p>
                  </div>
                </div>
                <div className={styles.map}>
                  <h1>위치 안내</h1>
                  <div className={styles.kakaomap}>
                    <GetKakaoMap
                      searchPlace={{
                        location: values.location,
                        buildingName: values.buildingname,
                      }}
                    />
                  </div>
                  <div className={styles.location}>
                    <span>{values.location}</span>
                    <a
                      href={`https://map.kakao.com/link/to/${values.location},${latLngResult.lat},${latLngResult.lng}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      길찾기
                    </a>
                  </div>
                </div>
                {isDisabled.status ? (
                  <></>
                ) : (
                  <div className={styles.check}>
                    <h1>신청 전 확인</h1>
                    <div className={styles.checkitem}>
                      <div
                        id="read"
                        className={checkListRed.read ? styles.Required : ''}
                      >
                        위 안내사항을 모두 확인하셨나요?
                      </div>
                      <div>
                        <label>
                          <input
                            type="radio"
                            name="read"
                            value="y"
                            checked={checkList.read === 'y'}
                            onChange={handleChangeCheckList}
                          />
                          네
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="read"
                            value="n"
                            checked={checkList.read === 'n'}
                            onChange={handleChangeCheckList}
                          />
                          아니요
                        </label>
                      </div>
                    </div>
                    <div className={styles.checkitem}>
                      <div
                        id="manner"
                        className={checkListRed.manner ? styles.Required : ''}
                      >
                        운동 중 매너 지켜주실거죠?
                      </div>
                      <div>
                        <label>
                          <input
                            type="radio"
                            name="manner"
                            value="y"
                            checked={checkList.manner === 'y'}
                            onChange={handleChangeCheckList}
                          />
                          네
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="manner"
                            value="n"
                            checked={checkList.manner === 'n'}
                            onChange={handleChangeCheckList}
                          />
                          아니요
                        </label>
                      </div>
                    </div>
                    <div className={styles.checkitem}>
                      <div
                        id="ball"
                        className={checkListRed.ball ? styles.Required : ''}
                      >
                        혹시 매치볼을 가져오시나요?
                      </div>
                      <div>
                        <label>
                          <input
                            type="radio"
                            name="ball"
                            value="y"
                            checked={checkList.ball === 'y'}
                            onChange={handleChangeCheckList}
                          />
                          네
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="ball"
                            value="n"
                            checked={checkList.ball === 'n'}
                            onChange={handleChangeCheckList}
                          />
                          아니요
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
            <section className={styles.cta_wrap}>
              {isDisabled.status ? (
                <div className={styles.hooking}>
                  {isDisabled.text} 되었습니다.
                </div>
              ) : (
                <div className={styles.hooking}>
                  마감까지{' '}
                  <strong style={{ color: 'red' }}>
                    {values.maximum - values.member.member.length}자리 남았어요!
                  </strong>
                </div>
              )}
              <div className={styles.btn_wrap}>
                <button onClick={joinGame} disabled={isDisabled.status}>
                  {isDisabled.text}
                </button>
              </div>
            </section>
          </>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default GameDetail;
