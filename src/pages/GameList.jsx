import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./pages.module.scss";
import useSupabase from "@/apis/useSupabase";
const GameList = () => {
  const supabase = useSupabase();
  const navigate = useNavigate();

  const [filters, setFilter] = useState({
    region: "전체",
    recruiting: true,
  });
  const handleChange = (e) => {
    setFilter({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const [gameList, setGameList] = useState([]);
  useEffect(() => {
    if (supabase) {
      const getGameList = async () => {
        try {
          const { data: Games, error } = await supabase
            .from("Games")
            .select("*");
          setGameList(Games);
        } catch (error) {
          console.error("Error", error.message);
          window.location.href = "/";
        }
      };
      getGameList();
    }
  }, [supabase]);

  const formmatDate = (data) => {
    const date = new Date(data);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    const ampm = hour >= 12 ? "오후" : "오전";
    const hour12 = hour % 12 || 12;

    const formattedDate = `${month}/${day}(${getWeekday(
      date
    )}) ${ampm} ${hour12}시 ${minute}분`;

    function getWeekday(date) {
      const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
      return weekdays[date.getDay()];
    }
    return formattedDate;
  };

  const linkDetail = (pageId) => {
    navigate(`/detail?id=${pageId}`);
  };
  return (
    <div>
      <div className={styles.game_list}>
        <section className={styles.introduce}>서비스 소개</section>
        <section className={styles.content_wrap}>
          <div className={styles.filter}>
            <select
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
            </select>
            <div>모집중만</div>
          </div>
          <div className={styles.list}>
            <ul>
              {gameList.map((item, index) => (
                <li key={index} onClick={() => linkDetail(item.id)}>
                  <div className={styles.tag}>
                    {item.status === "recruiting" ? (
                      <span className={styles.recruiting}>모집중</span>
                    ) : item.status === "done" ? (
                      <span className={styles.done}>모집마감</span>
                    ) : (
                      <span className={styles.closed}>모집종료</span>
                    )}
                    <span className={styles.versus}>{item.versus}</span>
                  </div>
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.game_info}>
                    <div className={styles.schedule}>
                      {formmatDate(item.schedule)}
                    </div>
                    <div>
                      {item.location.split(" ").slice(0, 2).join(" ")}{" "}
                      {item.buildingname}
                    </div>
                  </div>
                  <div>
                    {item.member.member.length} / {item.people}
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

export default GameList;
