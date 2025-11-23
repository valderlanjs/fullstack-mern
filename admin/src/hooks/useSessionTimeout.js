import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useSessionTimeout = (token, setToken) => {
  const navigate = useNavigate();

  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const warningTimer = useRef(null);
  const logoutTimer = useRef(null);
  const countdownInterval = useRef(null);

  // Configurações
  const WARNING_TIME = 5 * 60 * 1000; // 5 minutos antes
  const LOGOUT_TIME = 60 * 60 * 1000; // 1h total

  const clearAllTimers = () => {
    clearTimeout(warningTimer.current);
    clearTimeout(logoutTimer.current);
    clearInterval(countdownInterval.current);
  };

  const handleLogout = useCallback(() => {
    clearAllTimers();
    setIsWarningVisible(false);

    setToken("");
    localStorage.removeItem("token");

    toast.info("Sessão expirada. Faça login novamente.");
    navigate("/login");
  }, [navigate, setToken]);

  const startCountdown = () => {
    setTimeLeft(5 * 60);

    countdownInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetTimers = useCallback(() => {
    if (!token) return;

    clearAllTimers();

    setIsWarningVisible(false);

    // Timer para aviso
    warningTimer.current = setTimeout(() => {
      setIsWarningVisible(true);
      startCountdown();
    }, LOGOUT_TIME - WARNING_TIME);

    // Timer para logout total
    logoutTimer.current = setTimeout(() => {
      handleLogout();
    }, LOGOUT_TIME);
  }, [token, handleLogout]);

  // Eventos do usuário
  useEffect(() => {
    if (!token) return;

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

    const reset = () => resetTimers();

    events.forEach((ev) => document.addEventListener(ev, reset));

    return () => {
      events.forEach((ev) => document.removeEventListener(ev, reset));
    };
  }, [token, resetTimers]);

  // Reset timers quando token muda
  useEffect(() => {
    if (token) resetTimers();
    else clearAllTimers();

    return () => clearAllTimers();
  }, [token, resetTimers]);

  return {
    isWarningVisible,
    timeLeft,
    extendSession: resetTimers,
    handleLogout,
  };
};

export default useSessionTimeout;
