import React, { useEffect, useState } from 'react';
import styles from './pages.module.scss';
import useSupabase from '@/apis/useSupabase';
import { useUser } from '@/contexts/UserContext';
import { Button, ButtonGroup, TextField, InputAdornment } from '@mui/material';
import KakaoMap from '@/components/utils/KakaoMap';

const CreateGame = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const supabase = useSupabase();
  const { user } = useUser();

  const [values, setValues] = useState({
    organizer: user.id,
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
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'matchtime':
        const valueFloat = parseFloat(value);
        if (
          valueFloat >= 1 &&
          valueFloat <= 10 &&
          Number.isFinite(valueFloat) &&
          (valueFloat % 1 === 0 ||
            valueFloat.toString().split('.')[1].length <= 1)
        ) {
          setValues({
            ...values,
            matchtime: valueFloat,
          });
          setValidate({
            ...validate,
            matchtime: true,
          });
        } else if (value === '') {
          setValues({
            ...values,
            matchtime: value,
          });
          setValidate({
            ...validate,
            matchtime: false,
          });
        } else {
          setValidate({
            ...validate,
            matchtime: false,
          });
        }
        break;
      case 'minimum':
        const valueInt = parseInt(value);
        if (valueInt >= 2 && valueInt <= 20 && Number.isInteger(valueInt)) {
          setValues({
            ...values,
            minimum: valueInt,
          });
          setValidate({
            ...validate,
            minimum: true,
          });
        } else if (value === '') {
          setValues({
            ...values,
            minimum: value,
          });
          setValidate({
            ...validate,
            minimum: false,
          });
        } else {
          setValidate({
            ...validate,
            minimum: false,
          });
        }
        break;
      case 'maximum':
        if (value >= values.minimum) {
          setValues({
            ...values,
            maximum: value,
          });
          setValidate({
            ...validate,
            maximum: true,
          });
        } else if (value === '') {
          setValues({
            ...values,
            maximum: value,
          });
          setValidate({
            ...validate,
            maximum: false,
          });
        } else if (value === '1') {
          setValues({
            ...values,
            maximum: value,
          });
          setValidate({
            ...validate,
            maximum: false,
          });
        } else {
          setValidate({
            ...validate,
            maximum: false,
          });
        }
        break;
      default:
        setValues({
          ...values,
          [name]: value,
        });
        break;
    }
  };

  const [validate, setValidate] = useState({
    minimum: '',
    maximum: '',
    matchtime: '',
    read: '',
    manner: '',
    ball: '',
  });

  useEffect(() => {
    setValues({
      ...values,
      organizer: user.id,
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
        setValues({
          ...values,
          location: addr.address,
          buildingname: addr.buildingName,
        });
      },
    }).open();
  };

  const [checkList, setCheckList] = useState({
    read: '',
    manner: '',
    ball: '',
  });

  const handleChangeCheckList = (e) => {
    setCheckList({
      ...checkList,
      [e.target.name]: e.target.value,
    });
    if (e.target.value === 'y') {
      setValidate({
        ...validate,
        [e.target.name]: true,
      });
    } else {
      setValidate({
        ...validate,
        [e.target.name]: false,
      });
    }
    if (e.target.name === 'ball') {
      setValidate({
        ...validate,
        [e.target.name]: true,
      });
    }
  };

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  useEffect(() => {
    const isValues = Object.values(values).every(
      (value) => value !== '' && value !== null
    );
    const isValidates = Object.values(validate).every((value) => value);
    setIsSubmitDisabled(!(isValidates && isValues));
    console.log(values);
  }, [values, validate]);

  const createGame = async () => {
    console.log(values);
    if (!values.member.member.includes(user.id)) {
      values.member.member.push(user.id);
    }
    if (checkList.ball === 'y' && !values.member.withball.includes(user.id)) {
      values.member.withball.push(user.id);
    }
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
  console.log(validate.ball);

  return (
    <div>
      <div className={styles.create_game}>
        <section className={styles.content_wrap}>
          <form>
            <div className={styles.title}>
              <label>
                제목<span> *</span>
              </label>
              <TextField
                name="title"
                value={values.title}
                onChange={handleChange}
                placeholder="제목을 입력해주세요."
                size="small"
                required
              />
            </div>
            <div className={styles.schedule}>
              <label>
                일시<span> *</span>
              </label>
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
            <div className={styles.matchtime}>
              <label>
                운동시간<span> *</span>
              </label>
              <TextField
                {...(validate.matchtime === false
                  ? {
                      error: true,
                      helperText: '최대 10시간 이내로 숫자만 입력해주세요',
                    }
                  : {})}
                type="number"
                min="1"
                step="0.1"
                max="20"
                name="matchtime"
                value={values.matchtime}
                onChange={handleChange}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">시간</InputAdornment>
                  ),
                }}
                required
              />
            </div>
            <div id="versus" className={styles.versus}>
              <label>
                경기방식<span> *</span>
              </label>
              <ButtonGroup variant="outlined" fullWidth>
                <Button
                  className={styles.on}
                  type="button"
                  value="3vs3"
                  autoCapitalize="none"
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
              <label>
                모집인원<span> *</span>
              </label>
              <div>
                <TextField
                  {...(validate.minimum === false
                    ? {
                        error: true,
                        helperText: '최소 2명 이상 입력해주세요',
                      }
                    : {})}
                  type="number"
                  label="최소"
                  min="2"
                  step="1"
                  max="20"
                  name="minimum"
                  value={values.minimum}
                  onChange={handleChange}
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">명</InputAdornment>
                    ),
                  }}
                  required
                />
                <span>~</span>
                <TextField
                  {...(validate.maximum === false
                    ? {
                        error: true,
                        helperText: '최소인원 이상으로 입력해주세요',
                      }
                    : {})}
                  type="number"
                  label="최대"
                  min={values.minimum}
                  step="1"
                  max="20"
                  name="maximum"
                  value={values.maximum}
                  onChange={handleChange}
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">명</InputAdornment>
                    ),
                  }}
                  required
                />
              </div>
            </div>
            <div className={styles.location}>
              <label>
                운동장소<span> *</span>
              </label>
              <div>
                <TextField
                  name="location"
                  value={values.location}
                  onChange={handleChange}
                  placeholder="주소 검색을 클릭해주세요."
                  size="small"
                  disabled
                  fullWidth
                  required
                />
                <Button type="button" onClick={setAddress}>
                  주소 검색
                </Button>
              </div>
            </div>
            <div className={styles.kakaomap}>
              <KakaoMap
                searchPlace={{
                  location: values.location,
                  buildingName: values.buildingname,
                }}
              />
            </div>
            <div className={styles.info}>
              <label>
                모집내용<span> *</span>
              </label>
              <TextField
                name="info"
                style={{ flexGrow: '1' }}
                value={values.info}
                onChange={handleChange}
                placeholder="장소,시간,인원미충족시 운영여부 등을 알려주세요"
                multiline
                rows={6}
              />
            </div>
            <div className={styles.check}>
              <label>
                유의사항<span> *</span>
              </label>
              <div>
                <div className={styles.checkitem}>
                  <div
                    id="read"
                    className={validate.read === false ? styles.Required : ''}
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
                    className={validate.manner === false ? styles.Required : ''}
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
                  <div id="ball">혹시 매치볼을 가져오시나요?</div>
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
            </div>
          </form>
        </section>
        <section className={styles.cta_wrap}>
          <div className={styles.btn_wrap}>
            <button onClick={createGame} disabled={isSubmitDisabled}>
              매치 등록
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CreateGame;
