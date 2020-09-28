// import { Dispatch, SetStateAction, useDebugValue, useState } from "react";
import { useState, useDebugValue } from "react";

// type StateSetter<T> = Dispatch<SetStateAction<T>>
type Lazy<T> = T | (() => T);

// A more strict version of a boolean hook.
export const useToggle = (
  debugName: String,
  initial: Lazy<boolean>
): [boolean, () => void] => {
  const [isToggled, setToggled] = useState<boolean>(initial);

  const toggle = () => setToggled(!isToggled);

  //Consider making this prettier
  useDebugValue(debugName + ": " + isToggled);

  return [isToggled, toggle];
};

// A "burn after reading" style of hook.
// Once consumed, the value can never be changed.
// Consider making more abstract by allowing a hook to be passed in
export const useOnce = <T>(
  debugName: String,
  initial: Lazy<T>
): [T, (value: Lazy<T>) => void] => {
  const [state, setState] = useState<T>(initial);
  const [consumed, setConsumed] = useState<boolean>(false);

  const once = (value: Lazy<T>) => {
    if (!consumed) {
      setState(value);
      setConsumed(true);
    }
  };

  //Consider making cleaner
  useDebugValue(debugName);

  return [state, once];
};
