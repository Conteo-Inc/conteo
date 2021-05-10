import { IconButton } from "@material-ui/core"
import {
  Block,
  StopRounded,
  PlayCircleFilled,
  SendRounded,
  TheatersRounded,
  CheckCircleRounded,
  CancelRounded,
  RestorePageRounded,
} from "@material-ui/icons"
import * as React from "react"
import { Colors, ColorsType } from "../../utils/colors"
import { ActiveToolType } from "./editing/EditableVideo"

type ControlType =
  | ActiveToolType
  | "start"
  | "stop"
  | "send"
  | "loading"
  | "confirm"
  | "cancel"

export type ControlButtonProps = {
  ariaLabel?: string
  color?: ColorsType
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  size?: "inherit" | "default" | "small" | "large"
  type: ControlType
  disabled?: boolean
}

function Button({
  type,
  size,
}: Pick<ControlButtonProps, "type" | "size">): JSX.Element {
  return type === "start" ? (
    <PlayCircleFilled fontSize={size} />
  ) : type === "stop" ? (
    <StopRounded fontSize={size} />
  ) : type === "send" ? (
    <SendRounded fontSize={size} />
  ) : type === "trim" ? (
    <TheatersRounded fontSize={size} />
  ) : type === "confirm" ? (
    <CheckCircleRounded fontSize={size} />
  ) : type === "cancel" ? (
    <CancelRounded fontSize={size} />
  ) : type === "undo" ? (
    <RestorePageRounded fontSize={size} />
  ) : (
    <Block fontSize={size} />
  )
}

export default function ControlButton({
  ariaLabel,
  color = Colors.DEEP_RED,
  onClick,
  size = "default",
  type,
  disabled = false,
}: ControlButtonProps): JSX.Element {
  return (
    <IconButton
      aria-label={ariaLabel}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      style={{ color: color }}
    >
      <Button type={type} size={size} />
    </IconButton>
  )
}
