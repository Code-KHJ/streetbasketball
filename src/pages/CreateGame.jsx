import React, { useEffect, useState } from 'react';
import styles from './pages.module.scss';
import useSupabase from '@/apis/useSupabase';
import { useUser } from '@/contexts/UserContext';
import { Button, ButtonGroup, TextField } from '@mui/material';
import KakaoMap from '@/components/utils/KakaoMap';

const CreateGame = () => {
  const supabase = useSupabase();
  const { user } = useUser();

  const [values, setValues] = useState({
    organizer: user.id,
    title: '',
    schedule: '',
    versus: '',
    people: '',
    info: '',
    location: '',
    buildingname: '',
    member: { member: [] },
  });
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    setValues({
      ...values,
      organizer: user.id,
      member: { member: [user.id] },
    });
  }, [user]);
  const selectVersus = (e) => {
    document.querySelectorAll('#versus button').forEach((btn) => {
      btn.classList.remove(styles.on);
    });
    e.target.classList.add(styles.on);
    setValues({
      ...values,
      versus: e.target.value,
    });
  };

  const [minDateTime, setMinDateTime] = useState('');
  useEffect(() => {
    const now = new Date();
    const nowISO = now.toISOString().slice(0, 16);
    setMinDateTime(nowISO);
  }, []);

  const setAddress = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const addr = data; // 최종 주소 변수
        console.log(data.address);
        setValues({
          ...values,
          location: addr.address,
          buildingname: addr.buildingName,
        });
      },
    }).open();
  };

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  useEffect(() => {
    const isSubmit = Object.values(values).every(
      (value) => value !== null && value !== ''
    );
    setIsSubmitDisabled(!isSubmit);
  }, [values]);

  const createGame = async () => {
    try {
      const { data, error } = await supabase
        .from('Games')
        .insert([values])
        .select();

      if (error) {
        console.error('Error', error.message);
        alert('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        const gameId = data[0].id;
        alert('매치가 등록되었습니다.');
        window.location.href = `/detail?id=${gameId}`;
      }
    } catch (error) {
      console.error('Error', error.message);
      alert('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div>
      <div className={styles.create_game}>
        <section className={styles.content_wrap}>
          <h1 className={styles.title}>모집하기</h1>
          <form>
            <div className={styles.title}>
              <input
                type="text"
                name="title"
                placeholder="제목을 입력해주세요"
                value={values.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.schedule}>
              <label />
              <input
                type="datetime-local"
                min={minDateTime}
                step="1800"
                name="schedule"
                value={values.schedule}
                onChange={handleChange}
                required
              />
            </div>
            <div id="versus" className={styles.versus}>
              <label />
              <ButtonGroup variant="outlined">
                <Button
                  className={styles.on}
                  type="button"
                  value="3vs3"
                  onClick={selectVersus}
                >
                  3 vs 3
                </Button>
                <Button type="button" value="4vs4" onClick={selectVersus}>
                  4 vs 4
                </Button>
                <Button type="button" value="5vs5" onClick={selectVersus}>
                  5 vs 5
                </Button>
              </ButtonGroup>
            </div>
            <div className={styles.people}>
              <label />
              <span>
                <input
                  type="number"
                  max="20"
                  min="1"
                  name="people"
                  value={values.people}
                  onChange={handleChange}
                  required
                />
                명
              </span>
            </div>
            <div className={styles.location}>
              <label />
              <input
                name="location"
                placeholder="주소"
                value={values.location}
                onChange={handleChange}
                required
              />
              <button type="button" onClick={setAddress}>
                주소 검색
              </button>
            </div>
            <KakaoMap
              searchPlace={{
                location: values.location,
                buildingName: values.buildingname,
              }}
            />
            <div className={styles.info}>
              <label />
              <TextField
                name="info"
                style={{ flexGrow: '1' }}
                value={values.info}
                onChange={handleChange}
                placeholder="장소,시간,인원미충족시 운영여부 등을 알려주세요"
                multiline
                rows={4}
              />
            </div>
          </form>
        </section>
        <button
          className={styles.btn_create}
          onClick={createGame}
          disabled={isSubmitDisabled}
        >
          모집하기
        </button>
      </div>
    </div>
  );
};

export default CreateGame;
