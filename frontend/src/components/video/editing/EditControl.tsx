import * as React from "react"
import { Colors } from "../../../utils/colors"
import { Nullable, SetStateDispatch } from "../../../utils/context"
import ControlButton from "../ControlButton"
import { ActiveToolType } from "./EditableVideo"

type EditControlProps = {
  type: ActiveToolType
  onClick: VoidFunction
  selected: boolean
  setActiveTool: SetStateDispatch<Nullable<ActiveToolType>>
}
export default function EditControl({
  type,
  onClick,
  selected,
  setActiveTool,
}: EditControlProps): JSX.Element {
  return (
    <ControlButton
      type={type}
      color={selected ? Colors.DEEP_BLUE : Colors.DEEP_RED}
      size="large"
      onClick={() => {
        setActiveTool(type)
        onClick()
      }}
    />
  )
}
