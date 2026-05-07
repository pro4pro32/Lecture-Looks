"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

type InAppNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
};

const STARTER_NOTIFICATIONS: InAppNotification[] = [
  {
    id: "budget-style",
    title: "Nowy budzetowy look",
    message: "Nowy budzetowy look w Twoim stylu jest juz dostepny.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "price-drop",
    title: "Cena spadla o 30%",
    message: "Jeden z zapisanych produktow ma spadek ceny o 30%.",
    createdAt: new Date().toISOString(),
  },
];

export function NotificationsCenter() {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    const raw = window.localStorage.getItem("lecturelooks-notifications");
    if (raw) {
      setNotifications(JSON.parse(raw) as InAppNotification[]);
    } else {
      setNotifications(STARTER_NOTIFICATIONS);
      window.localStorage.setItem("lecturelooks-notifications", JSON.stringify(STARTER_NOTIFICATIONS));
    }
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    const nextPermission = await Notification.requestPermission();
    setPermission(nextPermission);

    if (nextPermission === "granted" && "serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification("LectureLooks", {
        body: "Powiadomienia web push sa aktywne.",
      });
    }
  };

  return (
    <section className="space-y-3 rounded-3xl border border-rose-200/10 bg-zinc-900/75 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-rose-300" />
          <h2 className="text-sm font-medium text-zinc-100">Notifications</h2>
        </div>
        <button
          type="button"
          onClick={() => void requestPermission()}
          className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-200"
        >
          {permission === "granted" ? "Web push ON" : "Wlacz web push"}
        </button>
      </div>
      <ul className="space-y-2 text-sm text-zinc-300">
        {notifications.map((item) => (
          <li key={item.id} className="rounded-xl border border-zinc-700/60 p-3">
            <p className="font-medium text-zinc-100">{item.title}</p>
            <p className="mt-1">{item.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
