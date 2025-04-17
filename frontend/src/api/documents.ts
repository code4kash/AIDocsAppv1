import { Document, ApiResponse, PaginatedResponse } from '@/types';
import { API_BASE_URL, DOCUMENT_ROUTES } from '@/config/constants';

export async function getDocuments(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Document>>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}${DOCUMENT_ROUTES.LIST}?page=${page}&limit=${limit}`
    );
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    return { error: 'Failed to fetch documents', status: 500 };
  }
}

export async function getDocument(id: string): Promise<ApiResponse<Document>> {
  try {
    const response = await fetch(`${API_BASE_URL}${DOCUMENT_ROUTES.DETAIL(id)}`);
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    return { error: 'Failed to fetch document', status: 500 };
  }
}

export async function uploadDocument(file: File): Promise<ApiResponse<Document>> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}${DOCUMENT_ROUTES.UPLOAD}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    return { error: 'Failed to upload document', status: 500 };
  }
}

export async function deleteDocument(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}${DOCUMENT_ROUTES.DETAIL(id)}`, {
      method: 'DELETE',
    });

    return { status: response.status };
  } catch (error) {
    return { error: 'Failed to delete document', status: 500 };
  }
} 