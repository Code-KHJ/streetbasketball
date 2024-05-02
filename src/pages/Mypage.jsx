import React, { useEffect } from 'react';
import styles from './pages.module.scss';
import { useUser } from '@/contexts/UserContext';
import useSupabase from '@/apis/useSupabase';
import { useState } from 'react';
import FormmatDate from '@/components/utils/FormmatDate';

const Mypage = () => {
  const { user } = useUser();
  const supabase = useSupabase();
  const [gameList, setGameList] = useState([]);

  useEffect(() => {
    if (supabase && user.id !== null) {
      const getGameList = async () => {
        try {
          const { data: Games, error } = await supabase
            .from('Games')
            .select('*')
            .contains('member', { member: [user.id] })
            .order('schedule', { ascending: true });
          setGameList(Games);
        } catch (error) {
          console.error('Error', error.message);
          window.location.href = '/mypage';
        }
      };
      getGameList();
    }
  }, [supabase, user]);

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

  return (
    <div>
      <div className={styles.mypage}>
        <section className={styles.content_wrap}>
          <div>
            <h1>
              신청한 매치
              <img src="/images/fire.png" alt="fire icon" />
            </h1>
            <ul>
              {gameList
                .filter((item) => {
                  return item.status !== 'closed';
                })
                .map((item, index) => (
                  <li>
                    <div className={styles.tag}>
                      {item.status === 'recruiting' ? (
                        <span className={styles.recruiting}>모집중</span>
                      ) : item.status === 'done' ? (
                        <span className={styles.done}>모집마감</span>
                      ) : (
                        <span className={styles.closed}>모집종료</span>
                      )}{' '}
                      <span className={styles.versus}>{item.versus}</span>
                    </div>
                    <div className={styles.title}>{item.title}</div>
                    <div className={styles.game_info}>
                      <div className={styles.schedule}>
                        <img src="/images/schedule.png" alt="clock icon" />
                        {FormmatDate(item.schedule)}
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
                    <button>신청취소</button>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h1>
              종료된 매치
              <img src="/images/fire.png" alt="fire icon" />
            </h1>
            <ul>
              {gameList
                .filter((item) => {
                  return item.status === 'closed';
                })
                .map((item, index) => (
                  <li>
                    <div className={styles.tag}>
                      {item.status === 'recruiting' ? (
                        <span className={styles.recruiting}>모집중</span>
                      ) : item.status === 'done' ? (
                        <span className={styles.done}>모집마감</span>
                      ) : (
                        <span className={styles.closed}>모집종료</span>
                      )}{' '}
                      <span className={styles.versus}>{item.versus}</span>
                    </div>
                    <div className={styles.title}>{item.title}</div>
                    <div className={styles.game_info}>
                      <div className={styles.schedule}>
                        <img src="/images/schedule.png" alt="clock icon" />
                        {FormmatDate(item.schedule)}
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
      </div>
    </div>
  );
};

export default Mypage;
