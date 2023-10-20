"use client";

require("../polyfill");

import { useState, useEffect } from "react";

import styles from "./home.module.scss";

import BotIcon from "../icons/bot.svg";
import LoadingIcon from "../icons/three-dots.svg";

import Sidebar from "./sidebar";

import { useChatStore } from "../store";
import { Chat } from "./chat";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "./error";
import LayoutWrapper from "./layoutWrapper";
import { useSwitchTheme } from "../function/useSwitchTheme";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={styles["loading-content"]}>
      {!props.noLogo && <BotIcon />}
      <LoadingIcon />
    </div>
  );
}

const Settings = dynamic(async () => (await import("./settings")).Settings, {
  loading: () => <Loading noLogo />,
});

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => <Loading noLogo />,
});

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

function _Home() {
  const loading = !useHasHydrated();
  const [showSideBar, setShowSideBar] = useState(true);

  // Setting
  const [openSettings, setOpenSettings] = useState(false);

  const [createNewSession, currentIndex, removeSession] = useChatStore(
    (state) => [
      state.newSession,
      state.currentSessionIndex,
      state.removeSession,
    ],
  );

  const chatStore = useChatStore();

  useSwitchTheme();

  if (loading) {
    return <Loading />;
  }

  return (
    <LayoutWrapper>
      <Sidebar
        title={process.env.NEXT_PUBLIC_TITLE ?? "Jarvis"}
        subTitle={
          process.env.NEXT_PUBLIC_SUB_TITLE ??
          "Using GPT-4 in Azure OpenAI Service"
        }
        setOpenSettings={setOpenSettings}
        createNewSession={createNewSession}
        chatStore={chatStore}
        setShowSideBar={setShowSideBar}
        showSideBar={showSideBar}
      >
        <ChatList />
      </Sidebar>
      <div className={styles["window-content"]}>
        {openSettings ? (
          <Settings
            closeSettings={() => {
              setOpenSettings(false);
              setShowSideBar(true);
            }}
          />
        ) : (
          <Chat
            key="chat"
            showSideBar={setShowSideBar}
            sideBarIsShowing={showSideBar}
          />
        )}
      </div>
    </LayoutWrapper>
  );
}

export function Home() {
  return (
    <ErrorBoundary>
      <_Home></_Home>
    </ErrorBoundary>
  );
}
