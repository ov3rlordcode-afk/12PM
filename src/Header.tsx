import React from "react";

type Role = "Customer" | "Driver" | "Operator" | "";

interface HeaderProps {
  email: string;
  password: string;
  role: Role;
  isLoginMode: boolean;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setRole: (v: Role) => void;
  handleLogin: () => void;
  validateStep1: () => void;
}

export default function Header({
  email,
  password,
  role,
  isLoginMode,
  setEmail,
  setPassword,
  setRole,
  handleLogin,
  validateStep1,
}: HeaderProps) {
  return (
    <>
      <h1 className="logo">Swift2Me</h1>
      <p className="subtitle">{isLoginMode ? "Login" : "Create Account"}</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Role selection only on signup */}
      {!isLoginMode && (
        <div className="roleSelection">
          {(["Customer", "Driver", "Operator"] as Role[]).map((r) => (
            <label key={r}>
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={(e) => setRole(e.target.value as Role)}
              />
              <span>{r}</span>
            </label>
          ))}
        </div>
      )}

      <button
        className="loginBtn"
        onClick={isLoginMode ? handleLogin : validateStep1}
      >
        {isLoginMode ? "Login" : "Next"}
      </button>
    </>
  );
}