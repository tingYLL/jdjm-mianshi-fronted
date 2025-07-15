"use server";
import {
  deleteQuestionUsingPost,
  listQuestionByPageUsingPost,
  listQuestionVoByPageUsingPost,
} from "@/api/questionController";
import Title from "antd/es/typography/Title";
import { Button, message, Space, Typography } from "antd";
import React, { useRef, useState } from "react";
import './index.css';
import QuestionTable from "@/components/QuestionTable";


/**
 * 题目列表页面
 * 通过searchParams可以获取到url上的搜索参数
 * @constructor
 */

export default async function QuestionsPage({ searchParams }) {
  //把q重命名为searchText
  const { q: searchText } = searchParams
  let questionList = [];
  let total = 0

  const pageSize = 200;
  try {
    const res = await listQuestionVoByPageUsingPost({
      pageSize: 12,
      sortField: "createTime",
      sortOrder: "descend",
      title: searchText
    });
    questionList = res.data.records ?? [];
    total = res.data.total ?? 0;
  } catch (e) {
    message.error("获取题目列表失败，" + e.message);
  }

  return (
    <div id="questionsPage" className="max-width-content">
      <Title level={3}>题目大全</Title>
      <QuestionTable defaultQuestionList={questionList} defaultTotal={total} defaultSearchParams={{
        title: searchText
      }
      } />
    </div>
  );
}
