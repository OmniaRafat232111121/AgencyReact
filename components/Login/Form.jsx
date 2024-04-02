import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../../utils/validation";
import { login } from "../../redux/lib/auth";
import { useDispatch } from "react-redux";


const LoginForm = ({NameUser}) => {
  console.log(NameUser)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  const onSubmit = async (data) => {
    
    try {
      const loginData = {
        identifier: data.identifier,
        password: data.password,

      };

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login/`,
      
        loginData,
        {
          headers: {
            "Content-Type": "application/json", 
          },
        }
      );
      console.log(response.data);
  const NameUser=response.data.Name;
  localStorage.setItem('NameUser', NameUser);
console.log(NameUser);



  const EmailUser=response.data.Email;
  localStorage.setItem('EmailUser', EmailUser);
console.log(EmailUser)
      toast.success("Login successful");
   

      dispatch(login({
        token: response.data.token, 
        id: response.data.id, 

      }));
      

      navigate("/");
     
      
    } catch (error) {
      // Handle login failure
      toast.error("Email or password may not be correct");
      console.error("Login failed", error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="2xl:max-w-2xl md:max-w-lg w-full mx-auto shadow-custom
      flex flex-col p-[60px] rounded-lg mt-[80px]  "
    >
      <h2 className="text-center text-blue font-extrabold text-3xl tracking-[0.3rem]
      hover:translate-x-8 duration-300 ease-in-out mb-3">RankTracker</h2>
      <h3 className="mt-3 text-lg font-bold text-blue lg:text-3xl md:text-2xl ">Sign-in</h3>
      <p className="mt-4 mb-3 text-md">Access Ranktracker using your name or email and password.</p>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-bold text-gray-700">
          Username or Email:
        </label>
        <input
          type="text"
          placeholder="Enter your username or email"
          {...register("identifier")} // Updated to usernameoremail
          className="w-full px-3 py-2 border rounded-lg md:text-lg text-md focus:border-blue focus:ring-darkblue"
        />
     
      </div>

      <div className="relative mb-6">
        <label className="font-bold text-gray-600 transition-all cursor-text peer-focus:text-xs peer-focus:-top-4 peer-focus:text-purple-600">
          Password:
        </label>
        <input
          placeholder="Enter your password"
          type={passwordVisible ? "text" : "password"} // Toggle password visibility
          {...register("password")}
          className="w-full px-3 py-2 border rounded-lg md:text-lg text-md focus:border-blue focus:ring-darkblue"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center px-2 mt-6 focus:outline-none"
        >
          {!passwordVisible ? (
            <HiEyeOff className="text-gray-600" />
          ) : (
            <HiEye className="text-gray-600" />
          )}
        </button>
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        className={`bg-blue text-white font-bold mt-5
         py-2 px-4 rounded `}
      >
        Sign In
      </button>


      <div className="mb-4 text-center">
  <p className="mt-4 text-md">
    Don't have an account?{" "}
    <span className="cursor-pointer text-blue">
      <Link to="/register">Create Account</Link>
    </span>
  </p>
</div>
    </form>
  );
};

export default LoginForm;
