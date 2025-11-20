import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const useSessionTimeout = (token, setToken, currentUser) => {
  const navigate = useNavigate();
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Tempo em milissegundos
  const WARNING_TIME = 10 * 60 * 1000; // 5 minutos para aviso
  const LOGOUT_TIME = 60 * 60 * 1000; // 1 hora para logout total

  let inactivityTimer;
  let warningTimer;

  const resetTimers = useCallback(() => {
    console.log("🔄 Timers resetados - usuário ativo");
    // Limpa timers existentes
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);

    // Esconde aviso se estiver visível
    if (isWarningVisible) {
      console.log("⚠️ Aviso escondido");
      setIsWarningVisible(false);
    }

    if (token) {
      // Configura timer de aviso
      warningTimer = setTimeout(() => {
        console.log("🚨 Aviso de sessão mostrado");
        setIsWarningVisible(true);
        setTimeLeft(5 * 60); // 5 minutos em segundos

        // Inicia contagem regressiva
        const countdown = setInterval(() => {
          setTimeLeft((prev) => {
            console.log("⏰ Tempo restante:", prev, "segundos");
            if (prev <= 1) {
              clearInterval(countdown);
              handleLogout();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, WARNING_TIME);

      // Configura timer de logout total
      inactivityTimer = setTimeout(() => {
        console.log('🔐 Logout automático por inatividade');
        handleLogout();
      }, LOGOUT_TIME);
    }
  }, [token, isWarningVisible]);

  const handleLogout = () => {
    console.log('🚪 Executando logout...');
    setToken("");
    localStorage.removeItem("token");
    setIsWarningVisible(false);
    toast.info("Sessão expirada por inatividade. Faça login novamente.");
    navigate("/login");
  };

  const extendSession = () => {
    console.log('✅ Sessão estendida pelo usuário');
    setIsWarningVisible(false);
    resetTimers();
    toast.success("Sessão estendida com sucesso!");
  };

  // Eventos que resetam o timer
  useEffect(() => {
    if (!token) return;

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    const resetTimer = () => {
      resetTimers();
    };

    events.forEach((event) => {
      document.addEventListener(event, resetTimer);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [token, resetTimers]);

  // Reset timers quando o token mudar
  useEffect(() => {
    resetTimers();

    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
    };
  }, [token, resetTimers]);

  // Interceptor do axios para verificar token expirado
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        // Verifica se há um novo token no header
        const newToken = response.headers["new-token"];
        if (newToken) {
          setToken(newToken);
          localStorage.setItem("token", newToken);
        }
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          const errorCode = error.response.data?.code;

          if (errorCode === "TOKEN_EXPIRED") {
            handleLogout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [setToken]);

  return {
    isWarningVisible,
    timeLeft,
    extendSession,
    handleLogout,
  };
};

export default useSessionTimeout;
