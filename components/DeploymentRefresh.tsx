"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { watchDeployment } from "@/lib/deploymentRefresh";

const BUILD = process.env.NEXT_PUBLIC_APP_BUILD_ID || "local";

export function DeploymentRefresh() {
  const pathname = usePathname();
  const [announcing, setAnnouncing] = useState(false);
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !/^\/(fitness|australia-2027)(\/|$)/.test(pathname)
    )
      return;
    return watchDeployment({ build: BUILD, onNotice: setAnnouncing });
  }, [pathname]);
  return announcing ? (
    <div className="deployment-refresh-notice" role="status">
      새 버전이 준비됐어요. 잠시 후 새로고침할게요.
    </div>
  ) : null;
}
