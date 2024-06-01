import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  createNewWorkspace,
  getAllWorkspace,
} from '~/redux/slices/workspaceSlice';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 2 characters')
    .max(255, 'Title must be max 255 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(3, 'Description must be at least 2 characters')
    .max(512, 'Description must be max 512 characters'),
});

export default function NewWorkspaceDialog({ open, setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateWorkspace = async (values) => {
    try {
      const resultAction = await dispatch(
        createNewWorkspace({ data: { ...values, type: 'private' } })
      );
      const result = unwrapResult(resultAction);
      if (result) {
        toast.success('Create workspace successfully!');
        dispatch(getAllWorkspace());
        navigate('/w/' + result._id);
      } else {
        toast.error('Create workspace failed! Please try again!');
      }
    } catch (err) {
      toast.error('Create workspace failed! Please try again!');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Workspace</DialogTitle>
      <Formik
        initialValues={{ title: '', description: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleCreateWorkspace(values);
          handleClose();
          setSubmitting(false);
        }}
      >
        {({ errors, touched, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <DialogContent>
              <Field
                as={TextField}
                autoFocus
                required
                margin="dense"
                size="small"
                name="title"
                label="Title"
                type="text"
                fullWidth
                variant="standard"
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
              />
              <Field
                as={TextField}
                required
                margin="dense"
                size="small"
                name="description"
                label="Description"
                fullWidth
                type="text"
                variant="standard"
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                Create
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
