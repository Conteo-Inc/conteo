import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Button, Typography } from "@material-ui/core"
import AbstractModal from "../AbstractModal"
import type { ProfileContentType } from "./ProfileContent"
import { Nullable } from "../../utils/context"
import { request } from "../../utils/fetch"

type UploadImageModalProps = {
  isModalOpen: boolean
  toggleModal: React.Dispatch<React.SetStateAction<boolean>>
  updateProfilePicture: (filePath: Nullable<string>) => void
}

const useStyles = makeStyles({
  container: {
    padding: "0 25px",
  },
  button: {
    margin: 5,
  },
  filename: {
    marginTop: 10,
  },
  error: {
    minHeight: "1.5rem",
    marginTop: 5,
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
      // Send file in form data.
      const formData = new FormData()
      formData.append("image_file", inputImageFile)
      request<ProfileContentType>({
        path: "/api/profile/",
        method: "put",
        body: formData,
        isFormData: true,
      })
        .then((res) => {
          updateProfilePicture(res.parsedBody.image_file)
          closeModal()
        })
        .catch((error) => {
          console.log(error)
        })
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
      <div>
        <Grid className={classes.container}>
          <Grid>
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
          <Grid className={classes.filename}>
            <Typography>
              {inputImageFile ? inputImageFile.name : "No file slected"}
            </Typography>
          </Grid>
          <Grid className={classes.error}>
            <Typography>{errorMessage}</Typography>
          </Grid>
        </Grid>
      </div>
    </AbstractModal>
  )
}
