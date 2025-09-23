import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastType } from "../toaster/Toast";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { UserInfoActionsContext } from "../userInfo/UserInfoContexts";
import { User, AuthToken, FakeData } from "tweeter-shared";

interface Props {
  originalUrl?: string;
  alias: string;
  setAlias: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  onKeyDownFunction: (event: React.KeyboardEvent<HTMLElement>) => void;
}


const authenticationFields = (props: Props) => {

    


    
    
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            placeholder="name@example.com"
            onKeyDown={props.onKeyDownFunction}
            onChange={(event) => props.setAlias(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control bottom"
            id="passwordInput"
            placeholder="Password"
            onKeyDown={props.onKeyDownFunction}
            onChange={(event) => props.setPassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
      </>
    );
}

export default authenticationFields;