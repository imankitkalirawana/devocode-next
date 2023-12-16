import React from "react";
import dynamic from "next/dynamic";
import Skeleton from "react-loading-skeleton";

const ContainerSkeleton = () => {
  return (
    <div className="container-fluid">
      <div className="container-stack">
        <div className="btn btn-slim btn-faded">
          <div>
            <Skeleton width={60} height={30} />
          </div>
        </div>
        <div className="container-narrative">
          <Skeleton width={100} height={30} />
          <Skeleton width={200} height={20} />
        </div>
      </div>
      <div className="container-stack-horizontal">
        <div className="container-sidebar">
          <div className="stack-title-card">
            <Skeleton width={30} height={30} />
            <h1>
              <Skeleton width={100} height={30} />
            </h1>
          </div>
          <div className="divider-horizontal"></div>
          <div className="stack-details">
            <div className="stack-progress">
              <div className="progress-line"></div>
              <span className="stack-name">
                <Skeleton width={100} height={20} />
              </span>
            </div>
            <div className="stack-progress">
              <div className="progress-line"></div>
              <span className="stack-name">
                <Skeleton width={100} height={20} />
              </span>
            </div>
          </div>
        </div>
        <div className="container-card-cover">
          <div className="container-card">
            <div className="container-card-header">
              <h2>
                <Skeleton width={200} height={30} />
              </h2>
            </div>
            <hr className="divider-horizontal" />
            <div className="container-card-form form">
              <div className="form-input">
                <label>
                  <Skeleton width={100} height={15} />
                </label>
                <Skeleton height={30} />
              </div>
              <div className="form-input">
                <label>
                  <Skeleton width={100} height={15} />
                </label>
                <Skeleton height={30} />
              </div>
              <div className="form-input">
                <label>
                  <Skeleton width={100} height={15} />
                </label>
                <Skeleton height={30} />
              </div>
              <div className="form-input form-btns">
                <Skeleton width={100} height={40} />
                <Skeleton width={100} height={40} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ContainerSkeleton), {
  ssr: false,
});
