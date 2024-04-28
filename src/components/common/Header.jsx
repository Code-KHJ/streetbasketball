import React, { useEffect } from 'react';
import styles from './common.module.scss';
import { Link, redirect, useLocation } from 'react-router-dom';
import useSupabase from '@/apis/useSupabase';
import { useUser } from '@/contexts/UserContext';

const Header = () => {
  const supabase = useSupabase();
  const { user } = useUser();
  const location = useLocation();
  const url = location.pathname + location.search;
  const signInWithKakao = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: process.env.REACT_APP_URL + url,
      },
    });
    if (error) throw error.message;
  };

  return (
    <header>
      <div className={styles.header_wrap}>
        <Link to="/" className={styles.logo}>
          logo
        </Link>
        {user.id !== null ? (
          <Link to="/mapage" className={styles.mypage}></Link>
        ) : (
          <button className={styles.login} onClick={signInWithKakao}>
            로그인
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
