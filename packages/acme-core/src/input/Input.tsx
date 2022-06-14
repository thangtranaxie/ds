import * as React from "react";
import styles from "./Input.module.scss";

export interface InputProps {
  className?: string;
}

export function Input(props: InputProps) {
  return <input className={styles.default} />;
}

Input.displayName = "Input";