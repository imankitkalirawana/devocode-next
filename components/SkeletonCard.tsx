import React from "react";
import Skeleton from "react-loading-skeleton";
import { isLoggedIn } from "@/utils/authUtils";
import dynamic from "next/dynamic";

const SkeletonCard = () => {
  const { loggedIn } = isLoggedIn();
  return (
    <div>
      <div className="section-card">
        <div className="section-card-upper">
          <div className="section-card-upper-left">
            <Skeleton width={30} height={30} />
            <div className="section-card-details">
              <Skeleton width={80} height={12} />
              <Skeleton width={150} height={16} />
            </div>
          </div>
          {loggedIn && (
            <div className="section-card-btn">
              <Skeleton width={20} height={20} />
            </div>
          )}
        </div>
        <div className="section-card-lower">
          <Skeleton width={80} height={10} />
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(SkeletonCard), { ssr: false });
