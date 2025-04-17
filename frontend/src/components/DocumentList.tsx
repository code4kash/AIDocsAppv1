import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography, TextField, Grid, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../contexts/AuthContext';

interface Document {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
}

export const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, [searchQuery]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/documents/my?search=${searchQuery}`);
      setDocuments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await apiClient.delete(`/documents/${id}`);
        setDocuments(documents.filter(doc => doc.id !== id));
      } catch (err) {
        setError('Failed to delete document');
        console.error(err);
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/documents/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/documents/${id}`);
  };

  const handleCreate = () => {
    navigate('/documents/create');
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          label="Search Documents"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '300px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreate}
        >
          Create New Document
        </Button>
      </Box>

      <Grid container spacing={3}>
        {documents.map((document) => (
          <Grid item xs={12} sm={6} md={4} key={document.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {document.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {new Date(document.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {document.isPublic ? 'Public' : 'Private'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <IconButton onClick={() => handleView(document.id)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(document.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(document.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 