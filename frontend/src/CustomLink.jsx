import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CustomLink = ({ to, children, ...props }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    navigate(to);
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default CustomLink;