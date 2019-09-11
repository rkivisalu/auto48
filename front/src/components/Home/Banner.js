import React from 'react';

const Banner = ({ appName, token }) => {
  if (token) {
    return null;
  }
  return (
    <div className="banner">
      <div className="container">
        <h1 className="logo-font">
          {appName.toUpperCase()}
        </h1>
        <p>The best market place for used cars 2019</p>
      </div>
    </div>
  );
};

export default Banner;
