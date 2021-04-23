import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Button, Typography } from "@material-ui/core"
import AbstractModal from "../AbstractModal"
import { Nullable } from "../../utils/context"

type UploadImageModalProps = {
  isModalOpen: boolean
  toggleModal: React.Dispatch<React.SetStateAction<boolean>>
  updateProfilePicture: (blob: Nullable<string>) => void
}

const useStyles = makeStyles({
  container: {
    padding: "0 25px",
  },
  button: {
    margin: "5px",
  },
  filename: {
    marginTop: "10px",
  },
  error: {
    minHeight: "1.5rem",
    marginTop: "5px",
    color: "red",
  },
})

export default function UploadProfilePicture({
  isModalOpen,
  toggleModal,
  updateProfilePicture,
}: UploadImageModalProps): JSX.Element {
  const classes = useStyles()
  const [errorMessage, setErrorMessage] = React.useState<string>("")
  const [inputImageFile, setInputImageFile] = React.useState<Nullable<File>>(
    null
  )

  const handleChangeImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.currentTarget.files
    const file = fileList && fileList.length > 0 ? fileList[0] : inputImageFile
    setInputImageFile(file)
    setErrorMessage("")
  }

  const handleConfirmUpload = () => {
    // Test if user selected a file.
    if (inputImageFile !== null) {
      const reader = new FileReader()
      reader.readAsDataURL(inputImageFile)
      reader.onload = () => {
        updateProfilePicture(reader.result as string)
        toggleModal(false)
        setErrorMessage("")
        setInputImageFile(null)
      }
    } else {
      setErrorMessage("You have not selected a file to save.")
    }
  }

  const closeModal = () => {
    toggleModal(false)
    setInputImageFile(null)
    setErrorMessage("")
  }

  return (
    <AbstractModal
      title="Upload Your Profile Picture"
      confirmText="Save"
      cancelText="Cancel"
      isModalOpen={isModalOpen}
      handleConfirm={handleConfirmUpload}
      handleCancel={closeModal}
    >
      <Grid container className={classes.container}>
        <Grid container justify="center" item>
          <input
            accept="image/*"
            hidden
            id="uploadImageButton"
            type="file"
            onChange={handleChangeImageInput}
          />
          <label htmlFor="uploadImageButton">
            <Button
              variant="contained"
              component="span"
              className={classes.button}
            >
              Select File
            </Button>
          </label>
        </Grid>
        <Grid container justify="center" item className={classes.filename}>
          <Typography>
            {inputImageFile ? inputImageFile.name : "No file slected"}
          </Typography>
        </Grid>
        <Grid container justify="center" item className={classes.error}>
          <Typography>{errorMessage}</Typography>
        </Grid>
      </Grid>
    </AbstractModal>
  )
}
