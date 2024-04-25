import React, { useState } from "react";
import styles from "./pages.module.scss";
const GameList = () => {
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
  console.log(filters.region);

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
            <div>지역필터</div>
            <div>모집중만</div>
          </div>
          <div>여기가 리스트</div>
        </section>
      </div>
    </div>
  );
};

export default GameList;
