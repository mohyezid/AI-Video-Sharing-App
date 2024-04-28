import {
  createContext,
  useContext,
  useState,
  useEffect,
  Children,
} from "react";
import { getCurrentUser } from "../lib/appWriteConfig";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoding, setIsLoding] = useState(true);
  useEffect(() => {
    getCurrentUser()
      .then((resp) => {
        if (resp) {
          setIsLoggedIn(true);

          setUser(resp);
        } else {
          setIsLoggedIn(false);

          setUser(null);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally((err) => {
        setIsLoding(false);
      });
  }, []);
  const [user, setUser] = useState(null);
  return (
    <GlobalContext.Provider
      value={{ isLoding, isLoggedIn, setIsLoggedIn, user, setUser }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
