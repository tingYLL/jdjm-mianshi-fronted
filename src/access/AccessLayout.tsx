/**
 * 统一权限校验拦截器
 * @param param0 
 */

import { getLoginUserUsingGet } from "@/api/userController";
import { AppDispatch, RootState } from "@/stores";
import { setLoginUser } from "@/stores/loginUser";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { findAllMenuItemByPath } from "../../config/menu";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "./checkAccess";
import Forbidden from "@/app/forbidden";

const AccessLayout: React.FC<
    Readonly<{ children: React.ReactNode }>
> =
    //初始化全局用户状态
    ({ children }) => {
        const pathname = usePathname()
        const loginUser = useSelector((state: RootState) => state.loginUser);
        const menu = findAllMenuItemByPath(pathname)
        const needAccess = menu?.access??ACCESS_ENUM.NOT_LOGIN
        const canAccess = checkAccess(loginUser,needAccess)
        if(!canAccess){
            return <Forbidden></Forbidden>
        }
        return children;
    }
export default AccessLayout;