"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, useCallback } from "react";

export default function Home() {
  const [path, setPath] = useState([
    {
      path: "/",
      name: "home",
    },
    { path: "/snake", name: "snake" },
    { path: "/small", name: "small" },
    { path: "/qi", name: "qi" },
    { path: "/yuansen", name: "yuansen" },
    { path: "/game/zhiwu", name: "zhiwu" },
    { path: "/game/kensi", name: "kensi" },
    { path: "/test", name: "test" },
    { path: "/hajimi", name: "hajimi" },
  ]);
  return (
    <div>
      {path.map((item) => {
        return (
          <div key={item.path}>
            <Link href={item.path} className="bg-red-300">
              {item.name}
            </Link>
          </div>
        );
      })}
      <div
        onClick={() => {
          const b = "bbbbb";
          console.log(b);
        }}
      >
        aaa
      </div>
    </div>
  );
}
