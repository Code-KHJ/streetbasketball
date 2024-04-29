import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useSupabase from '@/apis/useSupabase';
import { useUser } from '@/contexts/UserContext';
import styles from './pages.module.scss';
import { Button, TextField } from '@mui/material';
import FormmatDate from '@/components/utils/FormmatDate';
import KakaoMap from '@/components/utils/KakaoMap';
import KakaoMapLatLng from '@/components/utils/KakaoMapLatLng';

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
    people: '',
    info: '',
    location: '',
    buildingname: '',
    member: { member: [] },
    status: '',
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

  const isUserMember = values.member.member.includes(user.id);

  const joinGame = async () => {
    values.member.member.push(user.id);
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
        alert('신청되었습니다.');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error', error.message);
      alert('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    console.log(values.member.member);
  };

  return (
    <div>
      <div className={styles.game_detail}>
        <section className={styles.content_wrap}>
          <div className={styles.content}>
            <div className={styles.title}>
              <h1>{values.title}</h1>
              <div className={styles.location}>
                <span>
                  {values.location} ({values.buildingname})
                </span>
                <span> | </span>
                <span className={styles.copy_location} onClick={copyLocation}>
                  주소 복사
                </span>
              </div>
              <div className={styles.schedule}>
                {FormmatDate(values.schedule)}
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
                    10~14명
                  </li>
                  <li>
                    <img src="/images/hourglass.png" alt="hourglass icon" />
                    2시간
                  </li>
                  <li>
                    <img src="/images/basketball_black.png" alt="ball icon" />
                    OOO개 준비
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.game_info}>
              <h1>매치 안내</h1>
              <div>{values.info}</div>
            </div>
            <div className={styles.manner}>
              <h1>이것은 꼭 지켜주세요</h1>
              <div>안내사항을 전달합니다.</div>
            </div>
            <div className={styles.map}>
              <h1>위치 안내</h1>
              <div className={styles.kakaomap}>
                <KakaoMap
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
          </div>
        </section>
        <section className={styles.cta_wrap}>
          {values.status === 'closed' ? (
            <button className={styles.btn_join} disabled>
              모집종료
            </button>
          ) : values.status === 'done' ? (
            <button className={styles.btn_join} disabled>
              모집완료
            </button>
          ) : isUserMember ? (
            <button className={styles.btn_join} disabled>
              신청완료
            </button>
          ) : (
            <button className={styles.btn_join} onClick={joinGame}>
              신청하기
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default GameDetail;
