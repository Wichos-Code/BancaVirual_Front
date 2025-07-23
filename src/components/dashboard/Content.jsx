import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "../navs/Navbar";
import { useUserDetails } from "../../shared/hooks";

const SECTIONS = {
  users: "/bancavirtual/usuarios",
  accounts: "/bancavirtual/cuentas",
  accountsAdmin: "/bancavirtual/cuentas-admin",
  transfers: "/bancavirtual/transferencias",
  myaccounts: "/bancavirtual/mis-cuentas",
};

export function Content() {
  const { isLogged } = useUserDetails();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isLogged) {
    navigate("/bancavirtual/acceso");
    return null;
  }

  const getActiveSection = () => {
    const currentPath = location.pathname;

    if (currentPath.startsWith("/bancavirtual/my-favorites")) {
      return "myaccounts";
    }
    if (currentPath.startsWith(SECTIONS.myaccounts)) {
      return "myaccounts";
    }

    for (const key in SECTIONS) {
      if (currentPath === SECTIONS[key]) {
        return key;
      }
    }
    
    let longestMatchKey = "";
    let longestMatchPathLength = 0;


    const sortedKeys = Object.keys(SECTIONS).sort((a, b) => 
        SECTIONS[b].length - SECTIONS[a].length
    );

    for (const key of sortedKeys) {
        if (currentPath.startsWith(SECTIONS[key])) {
            return key;
        }
    }

    return "";
  };

  const activeSection = getActiveSection();

  const handleSelectSection = (key) => {
    const destination = SECTIONS[key];
    if (destination) {
      navigate(destination);
    }
  };

  return (
    <>
      <Navbar
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />
      <div className="content-container">
        <Outlet />
      </div>
    </>
  );
}