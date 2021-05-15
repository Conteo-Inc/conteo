import { colors } from "@material-ui/core"

export const Colors = {
  DEEP_RED: colors.red[900],
  DEEP_BLUE: colors.blue[900],
  GREY: colors.grey[800],
}

export type ColorsType =
  | typeof Colors["DEEP_RED"]
  | typeof Colors["DEEP_BLUE"]
  | typeof Colors["GREY"]

export const ColorStyle = { color: Colors.DEEP_RED }
export const ButtonStyle = {
  color: "white",
  backgroundColor: Colors.DEEP_RED,
  "&:hover": {
    backgroundColor: Colors.DEEP_BLUE,
  },
}
