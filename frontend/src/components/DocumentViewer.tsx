import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Chip
} from '@mui/material';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../contexts/AuthContext';

interface Document {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  userId: string;
}

export const DocumentViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/documents/${id}`);
      setDocument(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch document');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/documents/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await apiClient.delete(`/documents/${id}`);
        navigate('/documents');
      } catch (err) {
        setError('Failed to delete document');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!document) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Document not found</Typography>
      </Box>
    );
  }

  const isOwner = user?.id === document.userId;

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{document.title}</Typography>
        <Box>
          <Chip
            label={document.isPublic ? 'Public' : 'Private'}
            color={document.isPublic ? 'success' : 'default'}
            sx={{ mr: 1 }}
          />
          {isOwner && (
            <>
              <Button
                variant="outlined"
                onClick={handleEdit}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Created on {new Date(document.createdAt).toLocaleDateString()}
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
          {document.content}
        </Typography>
      </Paper>
    </Box>
  );
}; 