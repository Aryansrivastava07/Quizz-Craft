import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faArrowRight, faUser, faPhone, faUnlock } from "@fortawesome/free-solid-svg-icons";

export const Authenticate = () => {
  const [canvas,setcanvas] = useState(null);
  return (
    <div className="h-screen w-screen grid place-items-center bg-[linear-gradient(to_right,rgba(228,228,228,.1)_0%,rgba(228,228,228,1)_40%,rgba(228,228,228,.1)_90%)]">
      <div className="min-h-[80vh] w-[80vw] m-auto bg-white rounded-2xl shadow-2xl p-5 grid grid-cols-2">
        <div className="grid place-items-center">
          <img
            src="/logo2.png"
            alt=""
            className="w-[90%] aspect-auto"
          />
        </div>
        <div className="grid grid-rows-[auto_20px] ">
          {!canvas && <LoginForm setcanvas={setcanvas}/>}
          {canvas && <Registerform setcanvas={setcanvas}/>}
        </div>
      </div>
    </div>
  );
};
const LoginForm = ({setcanvas})=>{
  return (
    <>
    <div className="grid-cols-subgrid content-center">
            <h1 className="text-4xl font-bold text-center mb-10 text-[#333333]">
              User Login
            </h1>
            <form action="" method="post" className="w-[60%] place-self-center">
              <div className="h-full w-full flex flex-col">
                {/* <label htmlFor="userId">User ID </label> */}
                <div className="py-3 px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-5 flex items-center">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="pr-3 text-[#1e3050]"
                  />
                  <input
                    type="text"
                    id="userId"
                    name="userId"
                    className="outline-none w-full"
                    placeholder="User ID"
                  />
                </div>
                <div className="py-3 px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-5 flex items-center">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="pr-3 text-[#1e3050]"
                  />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="outline-none w-full"
                    placeholder="Password"
                  />
                </div>
                {/* <label htmlFor="password">Password </label> */}
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 py-3 px-5 outline-none rounded-full my-5 text-white font-bold cursor-pointer"
              >
                LOGIN
              </button>
            </form>
            <div className="w-full mb-5">
              <p className="text-center text-sm text-[#333333c3] cursor-pointer hover:text-[#333333]">
                Forgot UserID / Password
              </p>
            </div>
          </div>
          <div className="text-center cursor-pointer" onClick={()=>{
            setcanvas(1)
          }}>Create a Account 
            <FontAwesomeIcon icon={faArrowRight} className="pl-1 text-sm"/>
          </div>
    </>
  )
}
const Registerform = ({setcanvas})=>{
  return (
    <>
    <div className="grid-cols-subgrid content-center">
            <h1 className="text-4xl font-bold text-center mb-10 text-[#333333]">
              User Register
            </h1>
            <form action="" method="post" className="w-[60%] place-self-center">
              <div className="h-full w-full flex flex-col">
                <div className="py-3 px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-5">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="pr-3 text-[#1e3050]"
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="outline-none "
                    placeholder="Name"
                  />
                </div>
                <div className="py-3 px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-5">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="pr-3 text-[#1e3050]"
                  />
                  <input
                    type="email"
                    id="userId"
                    name="userId"
                    className="outline-none "
                    placeholder="Email"
                  />
                </div>
                <div className="py-3 px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-5">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="pr-3 text-[#1e3050]"
                  />
                  <input
                    type="number"
                    id="number"
                    name="number"
                    className="outline-none appearance-none"
                    placeholder="Number"
                  />
                </div>
                <div className="py-3 px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-5">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="pr-3 text-[#1e3050]"
                  />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="outline-none"
                    placeholder="Set Password"
                  />
                </div>
                <div className="py-3 px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-5">
                  <FontAwesomeIcon
                    icon={faUnlock}
                    className="pr-3 text-[#1e3050]"
                  />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="outline-none"
                    placeholder="Confirm Password"
                  />
                </div>
                {/* <label htmlFor="password">Password </label> */}
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 py-3 px-5 outline-none rounded-full my-5 text-white font-bold cursor-pointer"
              >
                REGISTER
              </button>
            </form>
            
          </div>
          <div className="text-center cursor-pointer" onClick={()=>{
            setcanvas(null)
          }}>Already a User
            <FontAwesomeIcon icon={faArrowRight} className="pl-1 text-sm"/>
          </div>
    </>
  )
}