"use client"; // 페이지 맨 위에 추가
import React, { useState, useEffect } from "react";
import LoadingSpinner from "./loading/loadingSpinner";
import LumiereSection001 from "./lumiere/Lumiere001";
import LumiereSection002 from "./lumiere/Lumiere002";
import LumiereSection003 from "./lumiere/Lumiere003";
import LumiereSection004 from "./lumiere/Lumiere004";
import LumiereSection005 from "./lumiere/Lumiere005";
import LumiereSection006 from "./lumiere/Lumiere006";
import LumiereSection007 from "./lumiere/Lumiere007";
import LumiereSection008 from "./lumiere/Lumiere008";
export default function Lumiere() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="transition-opacity duration-1000 ease-out opacity-100 animate-fadeIn">
      <LumiereSection001 />
      <LumiereSection002 />
      <LumiereSection003 />
      <LumiereSection005 />
      <LumiereSection004 />
      <LumiereSection007 />
      <LumiereSection006 />
      <LumiereSection008 />
    </div>
  );
}
