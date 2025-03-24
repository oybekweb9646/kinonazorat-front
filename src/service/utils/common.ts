import { api } from '../api';
import {
  HIGH_RISK_COLOR,
  HIGH_STATUS_SCORE,
  LOW_RISK_COLOR,
  MEDIUM_RISK_COLOR,
  MEDIUM_STATUS_SCORE,
} from '../const';
import { removeToken } from '../storage';

export const language = window.location.pathname.split('/')[1];

export const downloadFile = async (id: string, filename: string) => {
  try {
    const response = await api.get(`/file/download/${id}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Faylni yuklab olishda xatolik:', error);
  }
};

export function handleLogout() {
  removeToken();
  window.location.href = '/login';
}

export function handleAssessmentColor(score: number) {
  if (score >= HIGH_STATUS_SCORE) {
    return HIGH_RISK_COLOR;
  } else if (score >= MEDIUM_STATUS_SCORE) {
    return MEDIUM_RISK_COLOR;
  } else {
    return LOW_RISK_COLOR;
  }
}

export function hasPermission(role: number, permissions: number[]) {
  return permissions.includes(role);
}
