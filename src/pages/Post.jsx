import { React, useState, useEffect } from "react";
import PostPart from "./../component/post/PostPart";
import Header from "./../component/common/Header";
import Alert from "../component/common/Alert";
import AlertImg from "../assets/img/AlertImg.svg";
import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { instance } from "../api/instance";
import TimeAlert from "../component/common/TimeAlert";

function Post() {
  const { post_id } = useParams();
  const location = useLocation();
  const { apiData } = location.state || {};
  const navigate = useNavigate();
  const [alertShown, setAlertShown] = useState(false);
  const [moveShown, setMoveShown] = useState(false);

  const handleConfirm = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };
      const res = await instance.patch(
        `diary/diary/${post_id}/finish_diary/`,
        {},
        { headers }
      );

      if (res.status === 200) {
        if (res.data.status === "success") {
          navigate(`/months/${res.data.data.diary.month_id}`);
        } else if (res.data.status === "redirect") {
          navigate(`/months/${res.data.data[0].id}`);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAlert = () => {
    Alert(
      "오늘의 인터뷰를 종료하시겠습니까?",
      "인터뷰 종료 후에는 더 이상 수정이 불가합니다",
      AlertImg,
      "종료",
      () => {
        handleConfirm();
      }
    );
  };

  const handleTimeAlert = () => {
    TimeAlert();
  };

  useEffect(() => {
    const AlertHour = 4; // 오전 4시
    const AlertMinute = 45; // 45분

    const MoveHour = 5; // 오전 5시
    const MoveMinute = 0; // 0분
    const MoveSecond = 0; // 0초

    const checkTime = () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const currentSecond = currentTime.getSeconds();

      if (
        currentHour === AlertHour &&
        currentMinute === AlertMinute &&
        !alertShown
      ) {
        handleTimeAlert();
        setAlertShown(true); // 경고창이 표시된 후 상태 업데이트
      }

      if (
        currentHour === MoveHour &&
        currentMinute === MoveMinute &&
        currentSecond === MoveSecond &&
        !moveShown
      ) {
        navigate("/home");
        setMoveShown(true); // 홈으로 이동
      }
    };

    // 매 1초마다 시간을 확인합니다.
    const intervalId = setInterval(checkTime, 1000);

    return () => clearInterval(intervalId);
  }, [alertShown, moveShown]);

  return (
    <PostPage>
      <Header
        handleHome={handleAlert}
        handleMyInfo={handleAlert}
        handleLog={handleAlert}
      />
      <PostPart post_id={post_id} apiData={apiData} handleAlert={handleAlert} />
    </PostPage>
  );
}
const PostPage = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

export default Post;
