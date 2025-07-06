"use client";
import {
    GithubFilled,
    LogoutOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import {
    ProLayout
} from '@ant-design/pro-components';
import {
    Dropdown,
    Input,
} from 'antd';
import React, {useState} from 'react';
import Image from "next/image";
import {usePathname} from "next/navigation";
import Link from "next/link";
import GlobalFooter from "@/components/GlobalFooter";
import './index.css'
import {menus} from "../../../config/menu";
import { useSelector } from 'react-redux';
// import { RootState } from '@reduxjs/toolkit/query';
import { AppDispatch, RootState } from "@/stores";
import getAccessibleMenus from '@/access/menuAccess';
import MdEditor from '@/components/MdEditor';
import MdViewer from '@/components/MdViewer';

const SearchInput = () => {
    return (
        <div
            key="SearchOutlined"
            aria-hidden
            style={{
                display: 'flex',
                alignItems: 'center',
                marginInlineEnd: 24,
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}
        >
            <Input
                style={{
                    borderRadius: 4,
                    marginInlineEnd: 12,
                }}
                prefix={
                    <SearchOutlined/>
                }
                placeholder="搜索"
                variant="borderless"
            />
        </div>
    );
};

interface Props{
    children: React.ReactNode
}


export default function BasicLayout ({ children}:Props) {
    const loginUser = useSelector((state: RootState) => state.loginUser);
    const pathname = usePathname()
    return (
        <div
            id="basicLayout"
            style={{
                height: '100vh',
                overflow: 'auto',
            }}
        >
                    <ProLayout
                        title="ikun刷题平台"
                        layout="top"
                        logo={
                            <Image src="/assets/logo.png" height={32} width={32} alt="练习时长两年半"/>
                        }
                        location={{
                            pathname,
                        }}
                        avatarProps={{
                            src: loginUser.userAvatar || "/assets/logo.png",
                            size: 'small',
                            title: loginUser.userName || '蔡徐坤',
                            render: (props, dom) => {
                                return (
                                    <Dropdown
                                        menu={{
                                            items: [
                                                {
                                                    key: 'logout',
                                                    icon: <LogoutOutlined/>,
                                                    label: '退出登录',
                                                },
                                            ],
                                        }}
                                    >
                                        {dom}
                                    </Dropdown>
                                );
                            },
                        }}
                        actionsRender={(props) => {
                            if (props.isMobile) return [];
                            return [
                                <SearchInput key="search" />,
                                <a key="github" href="#" target="_blank">
                                    <GithubFilled key="GithubFilled"/>
                                </a>
                            ];
                        }}
                        headerTitleRender={(logo, title, _) => {
                            return  (
                                <a>
                                    {logo}
                                    {title}
                                </a>
                            );
                        }}
                        footerRender={() => {
                            return <GlobalFooter></GlobalFooter>
                        }}
                        onMenuHeaderClick={(e) => console.log(e)}
                        menuDataRender={()=>{
                            return getAccessibleMenus(loginUser,menus);
                        }}
                        menuItemRender={(item, dom) => (
                            <Link
                                href={item.path || "/"}
                                target={item.target}
                            >
                                {dom}
                            </Link>
                        )}
                    >
                        {/* <MdEditor value={text} onChange={setText}></MdEditor>
                        <MdViewer value={text}></MdViewer> */}
                        {children}
                    </ProLayout>
        </div>
    );
};