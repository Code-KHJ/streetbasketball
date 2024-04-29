import React, { useEffect } from "react";
import styles from "./common.module.scss";
import { Link, redirect, useLocation } from "react-router-dom";
import useSupabase from "@/apis/useSupabase";
import { useUser } from "@/contexts/UserContext";
import ToggleMenu from "./ToggleMenu";
import NavigateBeforeSharpIcon from "@mui/icons-material/NavigateBeforeSharp";
const Header = () => {
  const supabase = useSupabase();
  const { user } = useUser();
  const location = useLocation();
  const url = location.pathname + location.search;
  const signInWithKakao = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: process.env.REACT_APP_URL + url,
      },
    });
    if (error) throw error.message;
  };
  console.log(location.pathname);
  return (
    <header>
      <div className={styles.header_wrap}>
        {location.pathname === "/" ? (
          <Link to="/" className={styles.logo}>
            logo
          </Link>
        ) : (
          <Link
            to="/"
            className={styles.logo}
            style={{ color: "#000", padding: "4.5px 0", lineHeight: "0" }}
          >
            <NavigateBeforeSharpIcon />
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
