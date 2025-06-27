import { ReactNode } from "react";
import { redirect } from "next/navigation";
import {  isLoggedIn} from "@/lib/actions/auth.action";


const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await  isLoggedIn();
  if (isUserAuthenticated) redirect("/");
  return <div className="auth-layout">{children}</div>;
};
export default AuthLayout;