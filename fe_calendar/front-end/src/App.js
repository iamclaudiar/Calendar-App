import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Members from "./components/Members";
import Trainers from "./components/Trainers";
import LoginPage from "./components/WelcomePage";
import Locations from "./components/Locations";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import SubscriptionForm from "./components/Subscriptions";

const Main = () => {
  const [currentForm, setCurrentForm] = useState('login');

  const switchForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>

    <Route path="/login-gym-management" element={
        currentForm === 'login' ? 
          <Login role="GYMMANAGEMENT" onFormSwitch={switchForm} /> : 
          <Register role="GYMMANAGEMENT" onFormSwitch={switchForm} />
      } />

      <Route path="/login-trainer" element={
          currentForm === 'login' ? 
            <Login role="TRAINER" onFormSwitch={switchForm} /> : 
            <Register role="TRAINER" onFormSwitch={switchForm} />
        } />

      <Route path="/login-member" element={
          currentForm === 'login' ? 
            <Login role="MEMBER" onFormSwitch={switchForm} /> : 
            <Register role="MEMBER" onFormSwitch={switchForm} />
        } />

        <Route path="/members" element={<Members />} />
        <Route path="/trainers" element={<Trainers />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/locations" element={<Locations/>} />

        <Route path="/home" element={<Home/>}></Route>

        <Route path="/subscriptions" element={<SubscriptionForm/>}></Route>
      </Routes>
    </Router>
  );
};

export default Main;
