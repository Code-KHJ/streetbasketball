import React, { useState } from 'react';
import styles from './common.module.scss';
import { Button } from '@mui/material';
import MenuSharpIcon from '@mui/icons-material/MenuSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { useNavigate } from 'react-router-dom';
import useSupabase from '@/apis/useSupabase';

const ToggleMenu = () => {
  const supabase = useSupabase();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();
  const linkTo = (pageName) => {
    setIsOpen(false);
    navigate(`/${pageName}`);
  };
  const signOutWithKakao = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error.message;
    }
    window.location.href = `/`;
  };
  return (
    <div>
      <React.Fragment>
        <Button
          onClick={toggleMenu}
          style={{ color: '#000', padding: '6.5px 8px' }}
        >
          {isOpen ? (
            <CloseSharpIcon fontSize="large" />
          ) : (
            <MenuSharpIcon fontSize="large" />
          )}
        </Button>
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '65px',
              right: '30px',
              width: '150px',
              backgroundColor: '#fff',
              border: '1px solid #000',
              borderRadius: '15px',
              color: '#000',
              padding: '20px 20px 20px 0',
            }}
            className={styles.gnb_wrap}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Button onClick={() => linkTo('create')}>매치 생성</Button>
              <Button onClick={() => linkTo('')}>매치 목록</Button>
              <Button onClick={() => linkTo('mypage')}>신청 내역</Button>
              <Button onClick={signOutWithKakao}>로그 아웃</Button>
            </div>
          </div>
        )}
      </React.Fragment>
    </div>
  );
};

export default ToggleMenu;
