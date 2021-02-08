import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useProfile } from '../utils/profile'
import { Grid, Avatar, Typography, TextField, Button } from '@material-ui/core';

// This is what the ProfileContent component expects to receive from storage.
export type ProfileContentProps = {
    name: string
    username: string
    age: number
    gender: string
    occupations: string[]
    location: string
    interests: string[]
    religion: string
    profileImg: string
}

// A field listed in the content.
type ProfileField = {
    title: string
    value: string
}

type ProfileFieldList = {
    name: ProfileField
    username: ProfileField
    age: ProfileField
    gender: ProfileField
    occupations: ProfileField
    location: ProfileField
    interests: ProfileField
    religion: ProfileField
}

const useStyles = makeStyles({
    profileHeader: {
        padding: '0px 50px',
    },
    profileAvatar: {
        height: 200,
        width: 200,
    },
    introVideo: {
        height: 200,
        width: 400,
        backgroundColor: '#bdbdbd',
        color: 'white',
        textAlign: 'center',
    },
    fieldsContainer: {
        position: 'relative',
        boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
        borderRadius: 4,
        color: 'rgba(0, 0, 0, 0.87)',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        backgroundColor: '#fff',
        padding: '0 100px',
    },
    field: {
        fontSize: '2rem',
        padding: 5,
        paddingRight: 10,
    },
    bottomRight: {
        position: 'absolute',
        bottom: '0',
        right: '0',
        transform: 'translate(-10%, -10%)',
    },
    bottomRight2: {
        position: 'absolute',
        bottom: '0',
        right: '0',
        transform: 'translate(-100%, -10%)',
    },
})

export default function ProfileContent(props: ProfileContentProps) {
    const classes = useStyles()
    const [isEditMode, toggleEditMode] = React.useState(false)

    // Pass props to to useProfile hook.
    const { editableContent, setters } = useProfile(props)

    // Initialize readonly profile content and acquire hook to update it when edits are saved.
    const [readonlyContent, setProfile] = React.useState<ProfileContentProps>(editableContent);

    // User profile field list. Field values are assigned to readonly content.
    const fields: ProfileFieldList = {
        name: {
            title: 'Full Name',
            value: readonlyContent.name,
        },
        username: {
            title: 'Username',
            value: readonlyContent.username,
        },
        age: {
            title: 'Age',
            value: readonlyContent.age.toString(),
        },
        gender: {
            title: 'Gender',
            value: readonlyContent.gender,
        },
        occupations: {
            title: 'Occupations',
            value: readonlyContent.occupations.join(', '),
        },
        location: {
            title: 'Location',
            value: readonlyContent.location,
        },
        interests: {
            title: 'Interests',
            value: readonlyContent.interests.join(', '),
        },
        religion: {
            title: 'Religion',
            value: readonlyContent.religion,
        },
    }

    const handleEditBtnClick = (e) => {
        e.preventDefault()
        toggleEditMode(true)
    }

    const handleCancelBtnClick = (e) => {
        e.preventDefault()
        toggleEditMode(false)
    }

    const saveFields = (e) => {
        e.preventDefault()
        setProfile(editableContent)
        toggleEditMode(false)
    }

    return (
        <>
            <Grid container item className={classes.profileHeader} xs={12}>
                <Grid container item alignItems='center' justify='center' xs={6}>
                    <Avatar alt={props.name} src={props.profileImg} className={classes.profileAvatar} />
                </Grid>
                <Grid container item alignItems='center' justify='center' xs={6}>
                    <div className={classes.introVideo}>Intro Video</div>
                </Grid>
            </Grid>
            { !isEditMode &&
                <Grid container item alignItems='center' className={classes.fieldsContainer} xs={12}>
                    <Grid id={'readonlyContent'} container item alignItems='center' xs={12}>
                        {Object.keys(fields).map(function (key) {
                            const field: ProfileField = fields[key]
                            const { title, value } = field

                            return (
                                <Grid key={`${key}-readonlyFieldGrid`} item className={classes.field} sm={12} md={6}>
                                    <Typography id={`${key}-readonlyFieldText`}>{title}: {value}</Typography>
                                </Grid>
                            )
                        })}
                    </Grid>
                    <Button variant='contained' color='secondary' className={classes.bottomRight}
                        onClick={handleEditBtnClick}>Edit</Button>
                </Grid>
            }
            { isEditMode &&
                <Grid container item alignItems='center' className={classes.fieldsContainer} xs={12}>
                    <Grid id={'editableContent'} container item alignItems='center' xs={12}>
                        <Grid key={`name-editableFieldGrid`} item className={classes.field} sm={12} md={6}>
                            <TextField required label={fields.name.title}
                                defaultValue={fields.name.value}
                                onChange={e => { setters.setName(e.target.value) }} />
                        </Grid>
                        <Grid key={`username-editableFieldGrid`} item className={classes.field} sm={12} md={6}>
                            <TextField disabled label={fields.username.title}
                                defaultValue={fields.username.value}
                                onChange={e => { setters.setUsername(e.target.value) }} />
                        </Grid>
                        <Grid key={`age-editableFieldGrid`} item className={classes.field} sm={12} md={6}>
                            <TextField required label={fields.age.title}
                                defaultValue={fields.age.value}
                                onChange={e => { setters.setAge(Number(e.target.value)) }} />
                        </Grid>
                        <Grid key={`gender-editableFieldGrid`} item className={classes.field} sm={12} md={6}>
                            <TextField label={fields.gender.title}
                                defaultValue={fields.gender.value}
                                onChange={e => { setters.setGender(e.target.value) }} />
                        </Grid>
                        <Grid key={`occupations-editableFieldGrid`} item className={classes.field} sm={12} md={6}>
                            <TextField label={fields.occupations.title}
                                defaultValue={fields.occupations.value}
                                onChange={e => { setters.setOccupations(e.target.value.split(',')) }} />
                        </Grid>
                        <Grid key={`location-editableFieldGrid`} item className={classes.field} sm={12} md={6}>
                            <TextField label={fields.location.title}
                                defaultValue={fields.location.value}
                                onChange={e => { setters.setLocation(e.target.value) }} />
                        </Grid>
                        <Grid key={`interests-editableFieldGrid`} item className={classes.field} sm={12} md={6}>
                            <TextField label={fields.interests.title}
                                defaultValue={fields.interests.value}
                                onChange={e => { setters.setInterests(e.target.value.split(',')) }} />
                        </Grid>
                        <Grid key={`religion-editableFieldGrid`} item className={classes.field} sm={12} md={6}>
                            <TextField label={fields.religion.title}
                                defaultValue={fields.religion.value}
                                onChange={e => { setters.setReligion(e.target.value) }} />
                        </Grid>
                        <Button variant='contained' type='submit' color='primary' className={classes.bottomRight}
                            onClick={saveFields}>Save</Button>
                        <Button variant='contained' className={classes.bottomRight2}
                            onClick={handleCancelBtnClick}>Cancel</Button>
                    </Grid>
                </Grid>
            }
        </>
    )
}
