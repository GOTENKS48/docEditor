"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUser } from "@/components/providers/UserProvider";
import { ChevronDown, Check, UserCheck, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserSwitcherProps {
  compact?: boolean;
}

export function UserSwitcher({ compact = false }: UserSwitcherProps) {
  const { currentUser, allUsers, switchUser, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={cn(
          "group flex items-center gap-2.5 rounded-full border border-zinc-200/80 bg-white/90 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900/10",
          isOpen && "border-zinc-300 bg-zinc-50"
        )}
        title="Switch user to test sharing and access controls"
      >
        <div className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-semibold text-zinc-600">
              {currentUser.name.charAt(0)}
            </span>
          )}
          <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-white" />
        </div>

        {!compact && (
          <div className="flex flex-col text-left">
            <span className="text-xs font-medium text-zinc-900 leading-tight">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-zinc-500 leading-tight">
              {currentUser.email.split("@")[0]}
            </span>
          </div>
        )}

        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-zinc-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl shadow-zinc-950/5 ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-2 border-b border-zinc-100">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              <UserCheck className="h-3 w-3" />
              <span>Simulate Active User</span>
            </div>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              Switch accounts instantly to test ownership & permissions
            </p>
          </div>

          <div className="py-1">
            {allUsers.map((user) => {
              const isSelected = user.id === currentUser.id;
              return (
                <button
                  key={user.id}
                  onClick={() => {
                    switchUser(user.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors",
                    isSelected
                      ? "bg-zinc-100/90 font-medium text-zinc-900"
                      : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200/80">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[11px] font-semibold text-zinc-600">
                          {user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-zinc-900">{user.name}</div>
                      <div className="text-[10px] text-zinc-500">{user.email}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-zinc-900 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-t border-zinc-100 px-2.5 py-1.5 text-[10px] text-zinc-400 flex items-center gap-1.5">
            <Shield className="h-3 w-3" />
            <span>Seeded for instant permission testing</span>
          </div>
        </div>
      )}
    </div>
  );
}
