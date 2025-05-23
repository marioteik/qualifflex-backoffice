import { KeyboardEvent } from "react";

export enum KeyboardNavigation {
  Enter = "Enter",
  Delete = "Delete",
  Tab = "Tab",
  Backspace = "Backspace",
  decimal = ".",
  ArrowDown = "ArrowDown",
  ArrowUp = "ArrowUp",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
}

export const arrowNavigation = [
  KeyboardNavigation.ArrowDown,
  KeyboardNavigation.ArrowUp,
  KeyboardNavigation.ArrowLeft,
  KeyboardNavigation.ArrowRight,
];

export const upAndDownNavigation = [
  KeyboardNavigation.ArrowDown,
  KeyboardNavigation.ArrowUp,
];

export const keyboardNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export const onKeyboardPress =
  (
    keysToBind: KeyboardNavigation | KeyboardNavigation[] | string[],
    callback: (event: KeyboardEvent<Document>) => void,
  ) =>
  (event: KeyboardEvent<Document>) => {
    const pressedKey = event.key as KeyboardNavigation;

    if (keysToBind.includes(pressedKey)) {
      callback(event);
    }
  };
