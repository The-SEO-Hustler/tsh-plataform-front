import s from "./styles.module.css";
import cn from "clsx";

const Container = ({ children, className }) => {
  const rootclass = cn(s.container, className);

  return <div className={rootclass}>{children}</div>;
};
export default Container;
