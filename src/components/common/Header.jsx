import React, { useEffect } from 'react';
import styles from './common.module.scss';
import { Link, useLocation } from 'react-router-dom';
import useSupabase from '@/apis/useSupabase';
import { useUser } from '@/contexts/UserContext';
import ToggleMenu from './ToggleMenu';
import NavigateBeforeSharpIcon from '@mui/icons-material/NavigateBeforeSharp';
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
        scopes: `phone_number, plusfriends, talk_message, talk_calendar`,
      },
    });
    if (error) throw error.message;
  };

  return (
    <header>
      <div className={styles.header_wrap}>
        {location.pathname === '/' ? (
          <Link to="/" className={styles.logo}>
            <img
              src="/images/logo.png"
              style={{ width: '48px', verticalAlign: 'center' }}
              alt="logo"
            />
          </Link>
        ) : (
          <Link
            to="/"
            className={styles.logo}
            style={{ color: '#000', padding: '6.5px 0', lineHeight: '0' }}
          >
            <NavigateBeforeSharpIcon fontSize="large" />
          </Link>
        )}
        {user.id !== null ? (
          <ToggleMenu></ToggleMenu>
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
