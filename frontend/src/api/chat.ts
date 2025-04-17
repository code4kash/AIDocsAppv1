import { Message, ApiResponse } from '@/types';
import { API_BASE_URL, CHAT_ROUTES } from '@/config/constants';

export async function sendMessage(
  content: string,
  documentId?: string
): Promise<ApiResponse<Message>> {
  try {
    const response = await fetch(`${API_BASE_URL}${CHAT_ROUTES.SEND}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, documentId }),
    });

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    return { error: 'Failed to send message', status: 500 };
  }
}

export async function getChatHistory(
  documentId?: string,
  limit = 50
): Promise<ApiResponse<Message[]>> {
  try {
    const url = new URL(`${API_BASE_URL}${CHAT_ROUTES.HISTORY}`);
    if (documentId) url.searchParams.append('documentId', documentId);
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString());
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    return { error: 'Failed to fetch chat history', status: 500 };
  }
} 