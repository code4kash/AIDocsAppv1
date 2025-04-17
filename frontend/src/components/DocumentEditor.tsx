import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  CircularProgress
} from '@mui/material';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../contexts/AuthContext';

interface DocumentFormData {
  title: string;
  content: string;
  isPublic: boolean;
}

export const DocumentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<DocumentFormData>({
    title: '',
    content: '',
    isPublic: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/documents/${id}`);
      setFormData({
        title: response.data.title,
        content: response.data.content,
        isPublic: response.data.isPublic
      });
    } catch (err) {
      setError('Failed to fetch document');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await apiClient.put(`/documents/${id}`, formData);
      } else {
        await apiClient.post('/documents', formData);
      }
      navigate('/documents');
    } catch (err) {
      setError('Failed to save document');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Document' : 'Create New Document'}
      </Typography>

      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={10}
          required
        />

        <FormControlLabel
          control={
            <Checkbox
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
            />
          }
          label="Make this document public"
        />

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {id ? 'Update Document' : 'Create Document'}
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate('/documents')}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
}; 