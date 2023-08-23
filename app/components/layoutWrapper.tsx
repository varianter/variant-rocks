import { isMobileScreen } from "../utils";
import { useChatStore } from "../store";
import styles from "./home.module.scss";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = useChatStore((state) => state.config);

  return (
    <div
      className={`${
        config.tightBorder && !isMobileScreen()
          ? styles["tight-container"]
          : styles.container
      }`}
    >
      {children}
    </div>
  );
}
