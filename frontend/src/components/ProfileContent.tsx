import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Avatar, Typography, TextField, Button } from '@material-ui/core';

// This is what the ProfileContent component expects to receive from storage.
export type ProfileContentProps = {
    username: string;
    name: string;
    profileImg: string;
    gender: string;
    religion: string;
    location: string;
    occupations: string[];
    age: number | string,
    interests: string[];
};

// A field listed in the content.
type ProfileField = {
    title: string;
    value: string;
};

type ProfileFieldList = {
    name: ProfileField,
    username: ProfileField,
    age: ProfileField,
    gender: ProfileField,
    occupations: ProfileField,
    location: ProfileField,
    interests: ProfileField,
    religion: ProfileField,
};

const useStyles = makeStyles({
    profileHeader: {
        padding: '0 50',
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
});

export default function ProfileContent(props: ProfileContentProps) {
    const classes = useStyles();
    const [isEditMode, toggleEditMode] = React.useState(false)

    // Is used to compare fields that have been edited with their
    // original values.
    const [name, setName] = React.useState<string>()
    const [username, setUsername] = React.useState<string>()
    const [age, setAge] = React.useState<number | string>()
    const [gender, setGender] = React.useState<string>()
    const [occupations, setOccupations] = React.useState<string[]>()
    const [location, setLocation] = React.useState<string>()
    const [interests, setInterests] = React.useState<string[]>()
    const [religion, setReligion] = React.useState<string>()
    const [editedProfileFields, setEditableProfileFields] = React.useState<ProfileFieldList | null>(null)

    const readOnlyContent = 'readonly';
    const editableContent = 'editable';

    // Add user profile values to list.
    var profileFields: ProfileFieldList = {
        name: {
            title: 'Full Name',
            value: props.name,
        },
        username: {
            title: 'Username',
            value: props.username,
        },
        age: {
            title: 'Age',
            value: props.age.toString(),
        },
        gender: {
            title: 'Gender',
            value: props.gender,
        },
        occupations: {
            title: 'Occupations',
            value: props.occupations.join(', '),
        },
        location: {
            title: 'Location',
            value: props.location,
        },
        interests: {
            title: 'Interests',
            value: props.interests.join(', '),
        },
        religion: {
            title: 'Religion',
            value: props.religion,
        },
    };

    const handleEditBtnClick = (e) => {
        e.preventDefault()
        setEditableProfileFields(profileFields)
        toggleEditMode(true)
    }

    const handleCancelBtnClick = (e) => {
        e.preventDefault()
        setEditableProfileFields(profileFields)
        toggleEditMode(false)
    }

    const saveFields = (e) => {
        console.log('saving fields:')
        console.log(e.target)
        toggleEditMode(false)

        Object.keys(profileFields).forEach(key => {
            let originalField: ProfileField = profileFields[key]
            let editedField: ProfileField = editedProfileFields[key]
            const { title, value } = editedField

            // Test if field was changed.
            if (originalField.value != value) {
                console.log(`${title} was changed to: ${value}`)
                originalField.value = value
            }
            else {
                console.log(`${title} was not changed`)
            }
        });
    }

    return (
        <>
            <Grid container item className={classes.profileHeader} xs={12}>
                <Grid container item alignItems="center" justify="center" xs={6}>
                    <Avatar alt={props.name} src={props.profileImg} className={classes.profileAvatar} />
                </Grid>
                <Grid container item alignItems="center" justify="center" xs={6}>
                    <div className={classes.introVideo}>Intro Video</div>
                </Grid>
            </Grid>
            { isEditMode ? null :
                <Grid id={readOnlyContent} container item alignItems="center" className={classes.fieldsContainer} xs={12}>
                    <Button variant="contained" color="secondary" className={classes.bottomRight} onClick={handleEditBtnClick}>Edit</Button>
                    <Grid id={readOnlyContent} container item alignItems="center" xs={12}>
                        {Object.keys(profileFields).map(function (key) {
                            let field: ProfileField = profileFields[key];
                            const { title, value } = field;
                            return (
                                <Grid key={`${key}-readonlyFieldGrid`} item className={classes.field} sm={12} md={6}>
                                    <Typography id={`${key}-readonlyFieldText`}>{title}: {value}</Typography>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Grid>
            }
            { isEditMode ?
                <Grid id={editableContent} container item alignItems="center" className={classes.fieldsContainer} xs={12}>
                    <Grid id={editableContent} container item alignItems="center" xs={12}>
                        <Grid item className={classes.field} sm={3} md={6}>
                            <form onSubmit={saveFields}>
                                <TextField required label={editedProfileFields.name.title} defaultValue={editedProfileFields.name.value} onChange={(e) => { setName(e.target.value) }} />
                                <TextField disabled label={editedProfileFields.username.title} defaultValue={editedProfileFields.username.value} onChange={(e) => { setUsername(e.target.value) }} />
                                <TextField required label={editedProfileFields.age.title} defaultValue={editedProfileFields.age.value} onChange={(e) => { setAge(e.target.value) }} />
                                <TextField label={editedProfileFields.gender.title} defaultValue={editedProfileFields.gender.value} onChange={(e) => { setGender(e.target.value) }} />
                                <Button variant="contained" color="primary" type='submit' className={classes.bottomRight}>Save</Button>
                                <Button variant="contained" className={classes.bottomRight2} onClick={handleCancelBtnClick}>Cancel</Button>
                            </form>
                        </Grid>
                    </Grid>
                </Grid>
                : null
            }
        </>
    );
}
