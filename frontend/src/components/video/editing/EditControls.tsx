import * as React from "react"
import { ActiveToolType } from "./EditableVideo"
import * as R from "ramda"
import EditControl from "./EditControl"
import { Nullable, SetStateDispatch } from "../../../utils/context"

type EditControlsProps = {
  controlRecord: Record<ActiveToolType, VoidFunction>
  setActiveTool: SetStateDispatch<Nullable<ActiveToolType>>
  activeTool: Nullable<ActiveToolType>
}
export default function EditControls({
  controlRecord,
  setActiveTool,
  activeTool,
}: EditControlsProps): JSX.Element {
  return (
    <>
      {R.keys(controlRecord).map<JSX.Element>((key) => {
        return (
          <EditControl
            key={`editcontrol-${key}`}
            selected={activeTool === key}
            type={key}
            onClick={controlRecord[key]}
            setActiveTool={setActiveTool}
          />
        )
      }, controlRecord)}
    </>
  )
}
