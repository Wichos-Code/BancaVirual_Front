import React from 'react';
import PropTypes from 'prop-types';
import { useUserDetails } from '../../shared/hooks';
import { useNavigate } from "react-router-dom";

const MENU = [
  { key: 'users',        label: 'Usuarios',     roles: [ "ADMIN_ROLE", "CLIENT_ROLE","SUPERVISOR_ROLE" ] },
  { key: 'accounts',      label: 'Cuentas',      roles: [ "ADMIN_ROLE", "CLIENT_ROLE","SUPERVISOR_ROLE" ]   },
  { key: 'transfers',        label: 'Transferencias', roles: [ "ADMIN_ROLE", "CLIENT_ROLE","SUPERVISOR_ROLE" ] },
];

export const Navbar = ({ activeSection, onSelectSection }) => {
  const { isLogged, user, logout } = useUserDetails();
  const navigate = useNavigate();
  const role = user?.role;  
  
  return (
    <nav className="bg-[#163a5d] text-white px-6 py-3 flex items-center justify-between text-lg">
      <img
        src="/src/assets/img/LogoBF.png"
        alt="Logo"
        className="h-25 w-25 cursor-pointer"
      />

      <div className="flex space-x-4">
        {MENU
          .filter(item => item.roles.includes(role))
          .map(item => {
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelectSection(item.key)}
                className={`
                  px-4 py-3 rounded-full transition
                  ${isActive
                    ? 'text-yellow-700 bg-yellow-200 font-extrabold'
                    : 'text-white font-normal hover:bg-gray-700'}
                `}
                style={isActive ? { fontWeight: '550' } : {}}
              >
                {item.label}
              </button>
            );
          })
        }
      </div>

      {isLogged && (
        <button
          onClick={() => {
            navigate('/bancavirtual/acceso');
            logout();
          }}
          style={{ fontWeight: '550' }}
          className="
            bg-yellow-200 
            hover:bg-yellow-300 
            text-yellow-700
            px-4 py-3 
            rounded-full 
            font-semibold 
            transition-colors
          "
        >
          Cerrar Sesión
        </button>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  activeSection:   PropTypes.string.isRequired,
  onSelectSection: PropTypes.func.isRequired
};