"use client"
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { userRegisterUsingPost } from "@/api/userController";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores";
import { setLoginUser } from "@/stores/loginUser";
import { ProForm } from "@ant-design/pro-form/lib";
import { useRouter } from "next/navigation";
import './index.css';


/**
 * 用户注册页面
 * @returns 
 */

const UserRegisterPage: React.FC = () => {

    const [form] = ProForm.useForm();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const doSubmit = async (values: API.UserRegisterRequest) => {

        try {
            const res = await userRegisterUsingPost(values);
            if (res.data) {
                message.success("注册成功，请登录");
                //跳转到登录页面
                router.replace("/user/login");
                form.resetFields();
            }
        } catch (e) {
            message.error("注册失败," + e.message);
        }
    };

    return (
        <div id="userRegisterPage">
            <LoginForm
                logo={<Image src="/assets/logo.png" height={44} width={44} alt="logo" />}
                title="ikun平台 - 用户注册"
                subTitle="全球最大的ikun平台"
                form={form}
                onFinish={doSubmit}
                submitter={{
                    searchConfig:{
                        submitText:"注册",
                    }
                }}
            >
                <ProFormText
                    name="userAccount"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined />,
                    }}
                    placeholder={'请输入用户账号'}
                    rules={[
                        {
                            required: true,
                            message: '请输入用户账号!',
                        },
                    ]}
                />
                <ProFormText.Password
                    name="userPassword"
                    fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined />,
                    }}
                    placeholder={'请输入密码'}
                    rules={[
                        {
                            required: true,
                            message: '请输入密码！',
                        },
                    ]}
                />
                <ProFormText.Password
                    name="checkPassword"
                    fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined />,
                    }}
                    placeholder={'请输入确认密码'}
                    rules={[
                        {
                            required: true,
                            message: '请输入确认密码！',
                        },
                    ]}
                />

                <div
                    style={{
                        marginBlockEnd: 24,
                        textAlign: 'right',
                    }}
                >
                    已有账号？
                    <Link href={"/user/login"}>
                        去登录
                    </Link>
                </div>
            </LoginForm>
        </div>
    );
};

export default UserRegisterPage;