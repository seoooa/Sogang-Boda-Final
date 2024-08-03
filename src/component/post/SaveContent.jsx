import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { instance } from "../../api/instance";

function SaveContent({ apiData, contents, questions }) {
  const contentRef = useRef();
  useEffect(() => {
    // 스크롤을 항상 가장 아래로 이동
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [contents, questions]);
  return (
    <>
      <MyContent ref={contentRef}>
        <FirstQ>질문: {apiData.firstq}</FirstQ>
        {contents?.map((content, index) => (
          <QAndA key={index}>
            <A>나: {content.content}</A>
            <Q>질문: {questions[index]?.question}</Q>
          </QAndA>
        ))}
      </MyContent>
    </>
  );
}

const FirstQ = styled.div`
  color: #65744b;
`;

const Q = styled.div`
  color: #65744b;
`;

const A = styled.div`
  color: #3a3a3b;
  white-space: pre-wrap;
  margin-bottom: 40px;
`;

const QAndA = styled.div``;

const MyContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  color: #3a3a3b;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.8;
  height: 60%;
  margin: 0px 10px 0px 33px;
  padding-right: 37px;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* 기본적으로 스크롤바 숨김 */
  overflow-x: hidden;
  position: relative;
  /* Hover 상태에서 스크롤바 보이기 */
`;
export default SaveContent;