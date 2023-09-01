"use client";

require("../polyfill");

import { useState, useEffect } from "react";

import { IconButton } from "./button";
import styles from "./home.module.scss";

import SettingsIcon from "../icons/settings.svg";
import GithubIcon from "../icons/github.svg";
import CVIcon from "../icons/cv.svg";
import ChatIcon from "../icons/chat.svg";
import RobotIcon from "../icons/robotgpt.svg";

import BotIcon from "../icons/bot.svg";
import AddIcon from "../icons/add.svg";
import LoadingIcon from "../icons/three-dots.svg";
import CloseIcon from "../icons/close.svg";

import { ChatStore, useChatStore } from "../store";
import Locale from "../locales";

import { REPO_URL } from "../constant";
import { usePathname, useSearchParams } from "next/navigation";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={styles["loading-content"]}>
      {!props.noLogo && <BotIcon />}
      <LoadingIcon />
    </div>
  );
}

function useSwitchTheme() {
  const config = useChatStore((state) => state.config);

  useEffect(() => {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");

    if (config.theme === "dark") {
      document.body.classList.add("dark");
    } else if (config.theme === "light") {
      document.body.classList.add("light");
    }

    const metaDescriptionDark = document.querySelector(
      'meta[name="theme-color"][media]',
    );
    const metaDescriptionLight = document.querySelector(
      'meta[name="theme-color"]:not([media])',
    );

    if (config.theme === "auto") {
      metaDescriptionDark?.setAttribute("content", "#151515");
      metaDescriptionLight?.setAttribute("content", "#fafafa");
    } else {
      const themeColor = getComputedStyle(document.body)
        .getPropertyValue("--theme-color")
        .trim();
      metaDescriptionDark?.setAttribute("content", themeColor);
      metaDescriptionLight?.setAttribute("content", themeColor);
    }
  }, [config.theme]);
}

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

export default function Sidebar(props: {
  title: string;
  subTitle: string;
  setOpenSettings?: (newState: boolean) => void;
  createNewSession?: () => void;
  chatStore?: ChatStore;
  showSideBar?: boolean;
  setShowSideBar?: (newState: boolean) => void;
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const loading = !useHasHydrated();

  // setting
  const config = useChatStore((state) => state.config);

  useSwitchTheme();

  if (loading) {
    return <Loading />;
  }

  const isUrlSalesGPT = () => {
    if (pathName.includes("salesGPT")) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div
      className={
        styles.sidebar + ` ${props.showSideBar && styles["sidebar-show"]}`
      }
    >
      <div className={styles["sidebar-header"]}>
        <div className={styles["sidebar-title"]}>{props.title}</div>
        <div className={styles["sidebar-sub-title"]}>{props.subTitle}</div>
        <div className={styles["sidebar-logo"]}>
          <RobotIcon />
        </div>
      </div>

      <div
        className={styles["sidebar-body"]}
        onClick={() => {
          if (typeof props.setOpenSettings === "function") {
            props.setOpenSettings(false);
          }
          if (typeof props.setShowSideBar === "function") {
            props.setShowSideBar(false);
          }
        }}
      >
        {props.children}
      </div>

      <div className={styles["sidebar-tail"]}>
        <div className={styles["sidebar-actions"]}>
          <div className={styles["sidebar-action"] + " " + styles.mobile}>
            <IconButton
              icon={<CloseIcon />}
              onClick={() => {
                if (props.chatStore) {
                  props.chatStore.deleteSession;
                }
              }}
            />
          </div>
          <div className={styles["sidebar-action"]}>
            <IconButton
              icon={<SettingsIcon />}
              onClick={() => {
                if (typeof props.setOpenSettings === "function") {
                  props.setOpenSettings(true);
                }
                if (typeof props.setShowSideBar === "function") {
                  props.setShowSideBar(false);
                }
              }}
              shadow
            />
          </div>
          <div className={styles["sidebar-action"]}>
            <a href={REPO_URL} target="_blank">
              <IconButton icon={<GithubIcon />} shadow />
            </a>
          </div>
          {isUrlSalesGPT() ? (
            <div className={styles["sidebar-action"]}>
              <a href="/">
                <IconButton icon={<ChatIcon />} shadow />
              </a>
            </div>
          ) : (
            <div className={styles["sidebar-action"]}>
              <a href="salesGPT">
                <IconButton icon={<CVIcon />} shadow />
              </a>
            </div>
          )}
        </div>
        {!isUrlSalesGPT() && (
          <div>
            <IconButton
              icon={<AddIcon />}
              text={Locale.Home.NewChat}
              onClick={() => {
                if (typeof props.createNewSession === "function") {
                  props.createNewSession();
                }
                if (typeof props.setShowSideBar === "function") {
                  props.setShowSideBar(false);
                }
              }}
              shadow
            />
          </div>
        )}
      </div>
    </div>
  );
}
