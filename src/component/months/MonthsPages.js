import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { instance } from "../../api/instance";

function MonthsPage({ handleAlert }) {
  const navigate = useNavigate();
  const { month_id } = useParams();
  const [bookGroups, setBookGroups] = useState([]);
  const [showMessage, setShowMessage] = useState(false); // 메시지 표시 상태
  const [isMatchedDate, setIsMatchedDate] = useState(false);

  const getMonthName = (monthNumber) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthNumber - 1]; // monthNumber는 1부터 시작하므로 -1
  };

  // 더미 데이터를 가져오는 함수
  const getBookList = async () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    try {
      const res = await instance.get(
        `/diary/diary/list_diaries/?month_id=${month_id}`,
        {
          headers,
        }
      );
      // const res = await instance.get("")
      // const res = {
      //   status: "success",
      //   data: [
      //     {
      //       id: 2,
      //       firstq: "오늘의 기분은?",
      //       limitq_num: 6,
      //       created_date: "2024-07-26",
      //       created_time: "14:09:42.456900",
      //       is_complete: true,
      //       user_id: 1,
      //       month_id: 1,
      //     },
      //     {
      //       id: 3,
      //       firstq: "오늘의 기분은?",
      //       limitq_num: 6,
      //       created_date: "2024-07-27",
      //       created_time: "14:09:43.574033",
      //       is_complete: true,
      //       user_id: 1,
      //       month_id: 1,
      //     },
      //     {
      //       id: 4,
      //       firstq: "오늘의 기분은?",
      //       limitq_num: 6,
      //       created_date: "2024-08-01",
      //       created_time: "15:09:43.574033",
      //       is_complete: false,
      //       user_id: 1,
      //       month_id: 1,
      //     },
      //     // 필요에 따라 데이터 추가
      //   ],
      // };

      if (res.status === 200) {
        const groupedBooks = groupBooksByDate(res.data.data);
        setBookGroups(groupedBooks);
        calculateDate(res.data.data);
      }
    } catch (err) {
      alert(err);
    }
  };

  const calculateDate = async (data) => {
    const currentDateTime = new Date();
    const currentHour = currentDateTime.getHours();

    let relevantDate;
    if (currentHour < 5) {
      // 현재 시각이 오전 5시 이전인 경우 어제 날짜를 사용
      const yesterday = new Date();
      yesterday.setDate(currentDateTime.getDate() - 1);
      relevantDate = yesterday.toLocaleDateString("en-CA"); // YYYY-MM-DD 형식
    } else {
      // 현재 시각이 오전 5시 이후인 경우 오늘 날짜를 사용
      relevantDate = currentDateTime.toLocaleDateString("en-CA"); // YYYY-MM-DD 형식
    }

    const match = data.some((entry) => entry.created_date === relevantDate);

    setIsMatchedDate(match);

    if (match) {
      setIsMatchedDate(true);
    }
  };

  // 데이터를 날짜별로 그룹화하는 함수
  const groupBooksByDate = (data) => {
    const result = [];
    let tempGroup = [];

    data.forEach((item) => {
      tempGroup.push(item);

      if (tempGroup.length === 3) {
        result.push({
          date: tempGroup[0].created_date, // Using the date from the first item in the group
          books: [...tempGroup],
        });
        tempGroup = [];
      }
    });

    // If there are remaining books that didn't make a full group
    if (tempGroup.length > 0) {
      result.push({
        date: tempGroup[0].created_date,
        books: [...tempGroup],
      });
    }

    return result;
  };

  // 컴포넌트가 처음 렌더링될 때 데이터 가져오기
  useEffect(() => {
    getBookList();
  }, [month_id]);

  // bookGroups를 로컬 스토리지에 저장
  // useEffect(() => {
  //   localStorage.setItem("bookGroups", JSON.stringify(bookGroups));
  //   console.log(bookGroups);
  // }, [bookGroups]);

  //   // 클릭 여부 초기화 함수
  //   const resetClickedOnceIfNeeded = () => {
  //     const now = new Date();
  //     const resetHour = 5; // 오전 5시
  //     const resetDate = new Date(
  //       now.getFullYear(),
  //       now.getMonth(),
  //       now.getDate(),
  //       resetHour,
  //       0,
  //       0,
  //       0
  //     );

  //     if (now.getHours() < resetHour) {
  //       resetDate.setDate(resetDate.getDate() - 1);
  //     }

  //     const lastResetTime = localStorage.getItem("lastResetTime");
  //     if (!lastResetTime || new Date(lastResetTime) < resetDate) {
  //       setClickedOnce(false);
  //       localStorage.setItem("lastResetTime", now.toISOString());
  //     } else {
  //       setClickedOnce(JSON.parse(localStorage.getItem("clickedOnce")) || false);
  //     }
  //   };

  //   const isBookCreatedToday = () => {
  //     const today = new Date().toISOString().split("T")[0];
  //     return bookGroups.some((group) =>
  //       group.books.some((book) => book.created_date === today)
  //     );
  //   };

  const handleClick = async () => {
    getBookList();

    if (!isMatchedDate) {
      handleAlert();
    } else {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  // 전체 책 수 계산
  const totalBooks = bookGroups.reduce(
    (total, group) => total + group.books.length,
    ""
  );

  if (bookGroups.length === 0) {
    return (
      <Notice>
        <Caption>
          에세이 로딩 중입니다
          <br />
          잠시만 기다려주세요
        </Caption>
        <Spinner />
      </Notice>
    );
  }

  return (
    <>
      <Container>
        <Header>
          <Heading1>Interview</Heading1>
          <Heading2>{totalBooks}편의 인터뷰</Heading2>
        </Header>
        <BookContainer>
          {bookGroups.map((group, groupIndex) => (
            <SupportRectangleContainer key={groupIndex}>
              <BooksContainer>
                {group.books.map((item, index) => (
                  <BookWithDate key={index}>
                    <Rectangle
                      onClick={() => {
                        navigate(`/data/${item.id}`);
                      }}
                    >
                      <DateContainer>
                        <Day>{item.created_date.slice(8, 10)}</Day>{" "}
                        {/* 날짜의 일 부분만 표시 */}
                        <Divider />
                        <MonthYear>
                          <Month>
                            {getMonthName(
                              parseInt(item.created_date.slice(5, 7))
                            )}
                          </Month>{" "}
                          {/* 월 부분 표시 */}
                          <Year>{item.created_date.slice(0, 4)}</Year>{" "}
                          {/* 년도 부분 표시 */}
                        </MonthYear>
                      </DateContainer>
                    </Rectangle>
                  </BookWithDate>
                ))}
              </BooksContainer>
              <BookShelf />
            </SupportRectangleContainer>
          ))}
        </BookContainer>
        <NavButton onClick={handleClick}>+</NavButton>
        {showMessage && (
          <AlertMessage>이미 오늘의 인터뷰를 작성하셨습니다</AlertMessage>
        )}
      </Container>
    </>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  flex: 1;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Heading1 = styled.h1`
  display: fixed;
  color: #3a3a3b;
  text-align: center;
  font-size: 36px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 7.2px;
`;

const Heading2 = styled.h2`
  font-size: 20px;
  margin: 20px 0;
  text-align: center;
  color: #3a3a3b;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const BookContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 65%;
  height: 70%;
  overflow-y: hidden; /* 기본적으로 스크롤바 숨김 */
  overflow-x: hidden;
  position: relative;
  /* Hover 상태에서 스크롤바 보이기 */
  &:hover {
    overflow-y: auto;
  }
  /* 스크롤바 숨기기 (웹킷 브라우저) */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const BooksContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 30px;
  position: relative;
`;

const Rectangle = styled.div`
  width: 150px;
  height: 197.288px;
  margin: 0 10px;
  background-color: #f7f5ee;
  border: 1px solid #e2dfda;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0; /* 상단에 위치시키기 위해 패딩 추가 */
`;

const DateContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  padding: 15px;
`;

const Day = styled.div`
  color: #3a3a3b;
  font-size: 40px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Divider = styled.div`
  width: 1px;
  height: 50px;
  background-color: #000;
  margin-right: 10px;
  margin-left: 10px;
`;

const MonthYear = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Month = styled.div`
  color: #3a3a3b;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const Year = styled.div`
  color: #3a3a3b;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const BookShelf = styled.div`
  width: 900px;
  height: 10px;
  background-color: #4f4a36;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  margin-top: 20px;
  position: absolute;
  bottom: 0;
`;

const SupportRectangleContainer = styled.div`
  position: relative;
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;
`;

const BookWithDate = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 0 50px;
`;

const NavButton = styled.button`
  color: #f5f5e8;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 21px;
  border: none;
  height: 50px;
  width: 50px;
  border-radius: 30%;
  padding: 10px 20px;
  font-size: 40px;
  cursor: pointer;
  margin: 0 10px;
  background-color: #4f4a36;
  z-index: 1000;
`;

const AlertMessage = styled.div`
  position: fixed;
  bottom: 100px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 30px;
  padding: 10px 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  font-size: 18px;
`;

const Notice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

const Caption = styled.div`
  margin: 15px;
  margin-top: 30px;
  font-size: 20px;
  line-height: 130%;
  color: #4f4a36;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  margin: 20px 0px;
  border: 10px solid rgba(255, 255, 255, 0.5);
  border-top: 10px solid #4f4a36;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 2s linear infinite;
`;

export default MonthsPage;