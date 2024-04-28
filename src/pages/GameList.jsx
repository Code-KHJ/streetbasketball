import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './pages.module.scss';
import useSupabase from '@/apis/useSupabase';
import Switch from '@mui/material/Switch';
import { Box, FormControl, NativeSelect, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useUser } from '@/contexts/UserContext';

const GameList = () => {
  const { user } = useUser();
  const supabase = useSupabase();
  const navigate = useNavigate();

  const [filters, setFilter] = useState({
    region: '전체',
    recruiting: false,
  });
  const handleChange = (e) => {
    if (e.target.name === 'region') {
      setFilter({
        ...filters,
        [e.target.name]: e.target.value,
      });
    } else if (e.target.name === 'recruiting') {
      setFilter({
        ...filters,
        [e.target.name]: !filters.recruiting,
      });
    }
  };

  const [gameList, setGameList] = useState([]);
  const [allGameList, setAllGameList] = useState([]);

  useEffect(() => {
    if (supabase) {
      const getGameList = async () => {
        try {
          const { data: Games, error } = await supabase
            .from('Games')
            .select('*')
            .neq('status', 'closed')
            .order('schedule', { ascending: true });
          setAllGameList(Games);
        } catch (error) {
          console.error('Error', error.message);
          window.location.href = '/';
        }
      };
      getGameList();
    }
  }, [supabase]);

  useEffect(() => {
    if (allGameList.length > 0) {
      let filteredList = allGameList;
      if (filters.region !== '전체') {
        filteredList = filteredList.filter((game) =>
          game.location.includes(filters.region)
        );
      }
      if (filters.recruiting) {
        filteredList = filteredList.filter(
          (game) => game.status === 'recruiting'
        );
      }
      setGameList(filteredList);
    }
  }, [allGameList, filters]);

  const formmatDate = (data) => {
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

  const activePlayer = (active, all) => {
    const list = [];
    for (let i = 0; i < active.length; i++) {
      list.push(
        <img
          key={`active_${i}`}
          src="/images/active_player.png"
          alt="active player"
        />
      );
    }
    const unactive = all - active.length;
    for (let i = 0; i < unactive; i++) {
      list.push(
        <img
          key={`unactive_${i}`}
          src="/images/player.png"
          alt="unactive player"
        />
      );
    }
    return list;
  };

  const linkDetail = (pageId) => {
    navigate(`/detail?id=${pageId}`);
  };
  const linkCreate = () => {
    if (user.id !== null) {
      navigate(`/create`);
    } else {
      alert('로그인이 필요한 서비스입니다. 로그인 후 이용해주세요.');
    }
  };
  return (
    <div>
      <div className={styles.game_list}>
        <section className={styles.introduce}>서비스 소개</section>
        <section className={styles.content_wrap}>
          <div className={styles.filter}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <NativeSelect
                  name="region"
                  onChange={handleChange}
                  value={filters.region}
                >
                  <option value="전체">전체</option>
                  <option value="서울">서울</option>
                  <option value="부산">부산</option>
                  <option value="대구">대구</option>
                  <option value="인천">인천</option>
                  <option value="광주">광주</option>
                  <option value="대전">대전</option>
                  <option value="울산">울산</option>
                  <option value="세종">세종</option>
                  <option value="경기">경기</option>
                  <option value="강원">강원</option>
                  <option value="충북">충북</option>
                  <option value="충남">충남</option>
                  <option value="전북">전북</option>
                  <option value="전남">전남</option>
                  <option value="경북">경북</option>
                  <option value="경남">경남</option>
                  <option value="제주">제주</option>
                </NativeSelect>
              </FormControl>
            </Box>
            <div>
              <label>모집중</label>
              <Switch
                name="recruiting"
                checked={filters.recruiting}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Switch demo' }}
              />
            </div>
          </div>
          <div className={styles.list}>
            <ul>
              {gameList.map((item, index) => (
                <li key={index} onClick={() => linkDetail(item.id)}>
                  <div className={styles.tag}>
                    {item.status === 'recruiting' ? (
                      <span className={styles.recruiting}>모집중</span>
                    ) : item.status === 'done' ? (
                      <span className={styles.done}>모집마감</span>
                    ) : (
                      <span className={styles.closed}>모집종료</span>
                    )}
                    <span className={styles.versus}>{item.versus}</span>
                  </div>
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.game_info}>
                    <div className={styles.schedule}>
                      <img src="/images/schedule.png" alt="clock icon" />
                      {formmatDate(item.schedule)}
                    </div>
                    <span style={{ margin: '0 10px' }}>|</span>
                    <div className={styles.location}>
                      <img src="/images/location.png" alt="clock icon" />
                      {item.location.split(' ').slice(0, 2).join(' ')}{' '}
                      {item.buildingname}
                    </div>
                  </div>
                  <div className={styles.members}>
                    {activePlayer(item.member.member, item.people)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <Fab
          style={{ position: 'sticky', bottom: '60px', float: 'right' }}
          color="primary"
          aria-label="add"
          onClick={linkCreate}
        >
          <AddIcon />
        </Fab>
      </div>
    </div>
  );
};

export default GameList;
