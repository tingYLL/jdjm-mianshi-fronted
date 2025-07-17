"use client";
import {
    GithubFilled,
    LogoutOutlined,
    SearchOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    ProLayout
} from '@ant-design/pro-components';
import {
    Dropdown,
    Input,
    message,
} from 'antd';
import React, { useState } from 'react';
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import GlobalFooter from "@/components/GlobalFooter";
import './index.css'
import { menus } from "../../../config/menu";
import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@reduxjs/toolkit/query';
import { AppDispatch, RootState } from "@/stores";
import getAccessibleMenus from '@/access/menuAccess';
import MdEditor from '@/components/MdEditor';
import MdViewer from '@/components/MdViewer';
import { userLogoutUsingPost } from '@/api/userController';
import { setLoginUser } from '@/stores/loginUser';
import { DEFAULT_USER } from '@/constants/user';
import SearchInput from './components/SearchInput';



interface Props {
    children: React.ReactNode
}


export default function BasicLayout({ children }: Props) {
    const loginUser = useSelector((state: RootState) => state.loginUser);
    const pathname = usePathname()
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const userLogout = async () => {
        try {
            const res = await userLogoutUsingPost();
            message.success("已退出登录");
            dispatch(setLoginUser(DEFAULT_USER));
            router.push("/user/login");
        } catch (e) {
            message.error("退出登录失败," + e.message);
        }
    }


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
                <Image src="/assets/logo.png" height={32} width={32} alt="练习时长两年半" />
            }
            location={{
                pathname,
            }}
            avatarProps={{
                src: loginUser.userAvatar || "/assets/logo.png",
                size: 'small',
                title: loginUser.userName || '蔡徐坤',
                render: (props, dom) => {
                    if(!loginUser.id){
                        return <div onClick={()=>{
                            router.push("/user/login");
                        }}>
                            {dom}
                        </div>
                    }
                    return (
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: 'userCenter',
                                        icon: <UserOutlined />,
                                        label: '个人中心',
                                    },
                                    {
                                        key: 'logout',
                                        icon: <LogoutOutlined />,
                                        label: '退出登录',
                                    },
                                ],
                                onClick: async (event: { key: React.Key }) => {
                                    const { key } = event;
                                    if (key === 'logout') {
                                        userLogout();
                                    }else if(key === 'userCenter'){
                                        router.push("/user/center");
                                    }
                                }
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
                        <GithubFilled key="GithubFilled" />
                    </a>
                ];
            }}
            headerTitleRender={(logo, title, _) => {
                return (
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
            menuDataRender={() => {
                return getAccessibleMenus(loginUser, menus);
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
}