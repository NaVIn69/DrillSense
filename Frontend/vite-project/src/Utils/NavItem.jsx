// at top
import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

// small helper for consistent styling
const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-1.5 text-sm rounded-md transition
         ${isActive ? "bg-sky-500/20 text-sky-300" : "text-zinc-300 hover:bg-white/10"}`
      }
    >
      {children}
    </NavLink>
  );
export default NavItem  