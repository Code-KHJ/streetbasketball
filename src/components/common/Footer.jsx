import React from 'react';
import styles from './common.module.scss';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/detail' && location.pathname !== '/create' ? (
        <footer>
          <div className={styles.policy}>
            <a
              href="https://obvious-supernova-386.notion.site/d80155fcf4654b17ad3e15be0bb33d26?pvs=4"
              target="_blank"
              rel="noreferrer"
            >
              이용약관
            </a>
            <a
              href="https://obvious-supernova-386.notion.site/7949f0f25b924c4b87144338b564f605?pvs=4"
              target="_blank"
              rel="noreferrer"
            >
              개인정보처리방침
            </a>
          </div>
          <div className={styles.info}>
            <span>길거리농구(gilnong)</span>
            <span>대표자 김현준</span>
          </div>
          <div className={styles.info}>
            <span>사업자번호 197-07-02539</span>
            <span>
              문의:{' '}
              <a
                href="http://pf.kakao.com/_ZBlkG"
                target="_blank"
                rel="noreferrer"
              >
                카카오톡채널 @gilnong
              </a>
            </span>
          </div>
        </footer>
      ) : (
        <></>
      )}
    </>
  );
};

export default Footer;
