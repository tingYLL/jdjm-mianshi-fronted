"use client";
import CreateModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";
import {
  deleteQuestionUsingPost,
  listQuestionByPageUsingPost,
  listQuestionVoByPageUsingPost,
} from "@/api/questionController";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Space, Typography } from "antd";
import React, { useRef, useState } from "react";
import './index.css';
import TagList from "@/components/TagList";
import MdEditor from "@/components/MdEditor";
import Link from "next/link";

interface Props {
  defaultQuestionList?: API.QuestionVO[],
  defaultTotal?: number,
  defaultSearchParams:API.QuestionQueryRequest
}
/**
 * 题目表格组件
 *
 * @constructor
 */
const QuestionTable: React.FC = (props: Props) => {
  const actionRef = useRef<ActionType>();
  const { defaultQuestionList, defaultTotal,defaultSearchParams={} } = props;
  // 题目列表
  const [questionList, setQuestionList] = useState<API.QuestionVO[]>(
    defaultQuestionList || [],
  );
  // 题目总数
  const [total, setTotal] = useState<number>(defaultTotal || 0);
  //判断是否首次加载
  const [init, setInit] = useState<boolean>(true);

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.Question>[] = [

    // {
    //   title: "所属题库",
    //   dataIndex: "questionBankId",
    //   hideInTable: true,
    //   hideInForm: true,
    // },
    {
      title: "标题",
      dataIndex: "title",
      valueType: "text",
      render: (_, record) => {
        // const tagList = JSON.parse(record.tags || "[]");
        // return <TagList tagList={tagList} />
        return <Link href={`/question/${record.id}`}>{record.title}</Link>
      },
    },
    {
      title: "标签",
      dataIndex: "tags",
      valueType: "select",
      fieldProps: {
        mode: "tags",
      },
      render: (_, record) => {
        // const tagList = JSON.parse(record.tags || "[]");
        // return <TagList tagList={tagList} />
        return <TagList tagList={record.tagList} />
      },
    },
  ];

  return (
    <div className="question-table">
      <ProTable<API.QuestionVO>
        actionRef={actionRef}
        size="large"
        //自定义数据源 
        dataSource={questionList}
        form={{
          initialValues: defaultSearchParams,
        }}
        pagination={
          {
            pageSize: 12,
            showTotal: (total)=> `共 ${total} 条`,  
            showSizeChanger: false,
            total: total,
          } 
        }
        search={{
          labelWidth: "auto",
        }}

        request={async (params, sort, filter) => {
          //首次请求如果已经查询了数据，则不再请求
          if(init){
            setInit(false);
            if(defaultQuestionList && defaultTotal){
              return ;
            }
          }
          const sortField = Object.keys(sort)?.[0] || 'createTime';
          const sortOrder = sort?.[sortField] || 'descend'  ;

          const { data, code } = await listQuestionVoByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.QuestionQueryRequest);

          const newData = data?.records || []
          const newTotal = data?.total || 0;
          //更新状态
          setQuestionList(newData);
          setTotal(newTotal);

          //因为前面设置了dataSource，和total，所以不依赖这里的返回值（可改可不改）
          return {
            success: code === 0,
            data: newData,
            total: newTotal
          };
        }}
        columns={columns}
      />
    </div>
  );
};
export default QuestionTable;
