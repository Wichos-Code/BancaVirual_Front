import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "../navs/Navbar";
import { useUserDetails } from "../../shared/hooks";

const SECTIONS = {
  users: "/bancavirtual/usuarios",
  accounts: "/bancavirtual/cuentas",
  transfers: "/bancavirtual/transferencias",
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
    for (const key in SECTIONS) {
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
