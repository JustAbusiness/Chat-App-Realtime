import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();
// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  
  // DISPLAY USER TOKEN
  console.log("User Login", loginInfo)

  useEffect(() => {
      const user = localStorage.getItem("User");
      setUser(JSON.parse(user));
  },[]);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  })

  // REGISTER USER
  const registerUser = useCallback(async (e) => {
    e.preventDefault();

    setIsRegisterLoading(true);
    setRegisterError(null);
    const response = await postRequest(`${baseUrl}/api/users/register`, JSON.stringify(registerInfo))
    setIsRegisterLoading(false)
    if (response.error) {
      return setRegisterError(response)
    }


    localStorage.setItem("User", JSON.stringify(response));
    setUser(response)
  }, [registerInfo]);


//  LOGIN USER
  const loginUser = useCallback(async (e) => {
    e.preventDefault();

    setIsLoginLoading(true);
    setLoginError(null);
    const response = await postRequest(`${baseUrl}/api/users/login`, JSON.stringify(loginInfo))
    setIsLoginLoading(false)
    if (response.error) {
      return setLoginError(response)
    }

    localStorage.setItem("User", JSON.stringify(response));
    setUser(response)
  }, [loginInfo]);


  // LOGOUT USER
  const logoutUser = useCallback(() => {
     localStorage.removeItem("User");
     setUser(null); 
  });
  return (
    <AuthContext.Provider value={{ user, loginUser, registerInfo, loginInfo, updateRegisterInfo,
     registerUser, registerError, loginError, updateLoginInfo, isRegisterLoading, logoutUser, setLoginError, isLoginLoading}}>
      {children}
    </AuthContext.Provider>
  );
};
