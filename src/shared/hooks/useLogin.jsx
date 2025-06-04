import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (identifier, password) => {
    setIsLoading(true);
    try {
      const payload = /^\d+$/.test(identifier)
      ? { dpi: identifier, password }
      : { username: identifier, password };

      const response = await loginRequest(payload);

      if (response.error) {
        const errBody = response.e.response?.data || "Error al iniciar sesión";
        toast.error(
          typeof errBody === "string"
            ? errBody
            : errBody.error || errBody.message || JSON.stringify(errBody)
        );
        return;
      }

      const { data } = response;
      toast.success("¡Sesión iniciada correctamente!");

      const { userDetails } = data;

      console.log("userDetails:", userDetails);
      console.log("role recibido:", userDetails.role);
      localStorage.setItem("user", JSON.stringify(userDetails));

      switch (userDetails.role) {
        case "ADMIN_ROLE":
          navigate("/bancavirtual/usuarios");
          break;
        case "SUPERVISOR_ROLE":
          navigate("/bancavirtual/usuarios");
          break;
        case "CLIENT_ROLE":
          navigate("/bancavirtual/usuarios");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (err) {
      console.error("login fallo inesperado:", err);
      const errBody = err.response?.data || err.message;
      toast.error(typeof errBody === "string" ? errBody : JSON.stringify(errBody));
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
