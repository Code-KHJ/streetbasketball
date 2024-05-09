import React, { useEffect } from 'react';
import styles from './pages.module.scss';
import { useUser } from '@/contexts/UserContext';
import useSupabase from '@/apis/useSupabase';
import { useState } from 'react';
import FormmatDate from '@/components/utils/FormmatDate';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Mypage = () => {
  const { user } = useUser();
  const supabase = useSupabase();
  const [gameList, setGameList] = useState([]);
  const navigate = useNavigate();

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
          window.location.href = '/';
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
  const activeGamelist = gameList.filter((item) => item.status !== 'closed');
  const closedGamelist = gameList.filter((item) => item.status === 'closed');

  const cancel = async (gameId) => {
    const targetGame = activeGamelist.find((item) => item.id === gameId);
    if (targetGame === undefined) {
      alert('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      window.location.reload();
      return;
    }
    if (!targetGame.member.member.includes(user.id)) {
      alert('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      window.location.reload();
      return;
    }
    if (targetGame.organizer === user.id) {
      alert('주최자는 신청을 취소할 수 없습니다. 운영진에게 문의해주세요.');
      return;
    }

    const userConfirm = window.confirm('신청을 취소하시겠습니까?');
    if (!userConfirm) {
      return;
    }

    targetGame.member.member = targetGame.member.member.filter(
      (id) => id !== user.id
    );
    if (targetGame.member.withball.includes(user.id)) {
      targetGame.member.withball = targetGame.member.withball.filter(
        (id) => id !== user.id
      );
    }

    try {
      const { data, error } = await supabase
        .from('Games')
        .update({ member: targetGame.member })
        .eq('id', gameId)
        .select();

      if (error) {
        console.error('Error', error.message);
        alert('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        alert('취소되었습니다.');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error', error.message);
      alert('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const linkDetail = (pageId) => {
    navigate(`/detail?id=${pageId}`);
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
              {activeGamelist.length > 0 ? (
                activeGamelist.map((item, index) => (
                  <>
                    <li key={index}>
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
                      <div
                        className={styles.title}
                        onClick={() => linkDetail(item.id)}
                      >
                        {item.title}
                      </div>
                      <div className={styles.game_info}>
                        <div className={styles.schedule}>
                          {/* <img src="/images/schedule.png" alt="clock icon" /> */}
                          {FormmatDate(item.schedule)}
                        </div>
                        <span style={{ margin: '0 10px' }}>|</span>
                        <div className={styles.location}>
                          {/* <img src="/images/location.png" alt="clock icon" /> */}
                          {item.location.split(' ').slice(0, 2).join(' ')}{' '}
                          {item.buildingname}
                        </div>
                      </div>
                      <div className={styles.members}>
                        {activePlayer(item.member.member, item.people)}
                      </div>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => cancel(item.id)}
                      >
                        신청취소
                      </Button>
                    </li>
                  </>
                ))
              ) : (
                <div className={styles.no_game}>신청한 게임이 없습니다.</div>
              )}
            </ul>
          </div>
          <div className={styles.done_match}>
            <h1>
              종료된 매치
              <img src="/images/fire.png" alt="fire icon" />
            </h1>
            <ul>
              {closedGamelist.length > 0 ? (
                closedGamelist.map((item, index) => (
                  <li key={index} onClick={() => linkDetail(item.id)}>
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
                        {/* <img src="/images/schedule.png" alt="clock icon" /> */}
                        {FormmatDate(item.schedule)}
                      </div>
                      <span style={{ margin: '0 10px' }}>|</span>
                      <div className={styles.location}>
                        {/* <img src="/images/location.png" alt="clock icon" /> */}
                        {item.location.split(' ').slice(0, 2).join(' ')}{' '}
                        {item.buildingname}
                      </div>
                    </div>
                    <div className={styles.members}>
                      {activePlayer(item.member.member, item.people)}
                    </div>
                  </li>
                ))
              ) : (
                <div className={styles.no_game}>매치 내역이 없습니다.</div>
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Mypage;
