import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSupabase from "@/apis/useSupabase";
import { useUser } from "@/contexts/UserContext";
import styles from "./pages.module.scss";
import DaumMap from "@/components/utils/DaumMap";

const GameDetail = () => {
  const supabase = useSupabase();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const queryString = location.search;
  const keyValuePairs = queryString.substring(1).split("&");
  const keyValueObject = {};
  keyValuePairs.forEach((pair) => {
    const [key, value] = pair.split("=");
    keyValueObject[key] = value;
  });

  const [values, setValues] = useState({
    organizer: "",
    title: "",
    schedule: "",
    versus: "",
    people: "",
    info: "",
    location: "",
    member: { member: [] },
  });

  useEffect(() => {
    if (supabase) {
      const getGame = async () => {
        try {
          const { data: Games, error } = await supabase
            .from("Games")
            .select("*")
            .eq("id", keyValueObject["id"]);

          if (Games.length < 1) {
            navigate("/error");
          }
          setValues(Games[0]);
        } catch (error) {
          console.error("Error", error.message);
          alert("문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
      };
      getGame();
    }
  }, [supabase]);

  const isUserMember = values.member.member.includes(user.id);
  const today = new Date();
  const scheduleDate = new Date(values.schedule);
  scheduleDate.setHours(scheduleDate.getHours() - 1);

  const joinGame = async () => {
    values.member.member.push(user.id);
    try {
      const { data, error } = await supabase
        .from("Games")
        .update({ member: values.member })
        .eq("id", keyValueObject["id"])
        .select();

      if (error) {
        console.error("Error", error.message);
        alert("문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        alert("신청되었습니다.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error", error.message);
      alert("문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
    console.log(values.member.member);
  };

  return (
    <div>
      <div className={styles.game_detail}>
        <section className={styles.content_wrap}>
          <h1 className={styles.title}>모집하기</h1>
          <div className={styles.content}>
            <div className={styles.title}>
              <div>{values.title}</div>
            </div>
            <div className={styles.schedule}>
              <label />
              <input
                type="datetime-local"
                name="schedule"
                defaultValue={values.schedule.slice(0, 16)}
                disabled
                readOnly
              />
            </div>
            <div id="versus" className={styles.versus}>
              <label />
              <button className={styles.on} type="button" disabled readOnly>
                {values.versus}
              </button>
            </div>
            <div className={styles.people}>
              <label />
              <span>
                {values.member.member.length}/{values.people}명
              </span>
            </div>
            <div className={styles.info}>
              <label />
              <textarea
                name="info"
                value={values.info}
                rows={4}
                readOnly
                disabled
              />
            </div>
            <div className={styles.location}>
              <label />
              <input
                name="location"
                placeholder="주소"
                value={values.location}
                disabled
                readOnly
              />
            </div>
          </div>
          <DaumMap searchPlace={values.location} />
        </section>
        {today > scheduleDate ? (
          <button className={styles.btn_join} disabled>
            모집종료
          </button>
        ) : values.member.member.length >= values.people ? (
          <button className={styles.btn_join} disabled>
            모집완료
          </button>
        ) : isUserMember ? (
          <button className={styles.btn_join} disabled>
            신청완료
          </button>
        ) : (
          <button className={styles.btn_join} onClick={joinGame}>
            신청하기
          </button>
        )}
      </div>
    </div>
  );
};

export default GameDetail;
