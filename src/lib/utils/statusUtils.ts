// src/lib/utils/statusUtils.ts
import type { ClientStatus, ProspectStatus } from '$lib/types';

// クライアントステータスの表示名
export function getClientStatusName(status: ClientStatus): string {
  const statusNames = {
    'to_do': 'À faire',
    'in_progress': 'En cours',
    'done': 'Terminé'
  };
  return statusNames[status] || status;
}

// クライアントステータスの色クラス
export function getClientStatusColorClass(status: ClientStatus): string {
  const statusClasses = {
    'to_do': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'in_progress': 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100',
    'done': 'bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-100'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
}

// プロスペクトステータスの表示名
export function getProspectStatusName(status: ProspectStatus): string {
  const statusNames = {
    'new_inquiry': 'Nouvelle demande',
    'contact_attempted_phone': 'Contact tenté (tél)',
    'contact_attempted_email': 'Contact tenté (email)',
    'contacted_no_response': 'Contacté (sans réponse)',
    'meeting_scheduled': 'Rendez-vous prévu',
    'waiting_for_feedback': 'Attente de retour',
    'follow_up_needed': 'Suivi nécessaire',
    'qualified': 'Qualifié',
    'converted': 'Converti',
    'disqualified': 'Disqualifié'
  };
  return statusNames[status] || status;
}

// プロスペクトステータスの色クラス
export function getProspectStatusColorClass(status: ProspectStatus): string {
  const statusClasses = {
    'new_inquiry': 'bg-accent-100 text-accent-800 dark:bg-accent-800 dark:text-accent-100',
    'contact_attempted_phone': 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
    'contact_attempted_email': 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
    'contacted_no_response': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'meeting_scheduled': 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100',
    'waiting_for_feedback': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    'follow_up_needed': 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100',
    'qualified': 'bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-100',
    'converted': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    'disqualified': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
}

// プロスペクト関心レベルの表示名
type InterestLevel = 'low' | 'medium' | 'high';
export function getInterestLevelName(level: string): string {
  const levelNames: Record<InterestLevel, string> = {
    'low': 'Faible',
    'medium': 'Moyen',
    'high': 'Élevé'
  };
  return levelNames[level as InterestLevel] || level;
}

// プロスペクト関心レベルの色クラス
export function getProspectInterestColorClass(level: string): string {
  const levelClasses: Record<InterestLevel, string> = {
    'low': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    'high': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
  };
  return levelClasses[level as InterestLevel] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
}

// APIステータスの変換（バックエンドとフロントエンドの形式が異なる場合）
export function convertApiClientStatus(apiStatus: string): ClientStatus {
  // API形式からフロントエンドの形式に変換するマッピング
  const statusMapping: Record<string, ClientStatus> = {
    // 例: バックエンドとフロントエンドで異なる場合
    // 'backend_status': 'frontend_status' 
  };
  
  return statusMapping[apiStatus] || apiStatus as ClientStatus;
}

// プロスペクトAPIステータスの変換
export function convertApiProspectStatus(apiStatus: string): ProspectStatus {
  // API形式からフロントエンドの形式に変換するマッピング
  const statusMapping: Record<string, ProspectStatus> = {
    // 例: バックエンドとフロントエンドで異なる場合
    // 'backend_status': 'frontend_status'
  };
  
  return (statusMapping[apiStatus] as ProspectStatus) || apiStatus as ProspectStatus;
}

// クライアントステータスのオプション一覧（セレクトボックス用）
export function getClientStatusOptions() {
  return [
    { value: 'to_do', label: 'À faire' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'done', label: 'Terminé' }
  ];
}

// プロスペクトステータスのオプション一覧（セレクトボックス用）
export function getProspectStatusOptions() {
  return [
    { value: 'new_inquiry', label: 'Nouvelle demande' },
    { value: 'contact_attempted_phone', label: 'Contact tenté (tél)' },
    { value: 'contact_attempted_email', label: 'Contact tenté (email)' },
    { value: 'contacted_no_response', label: 'Contacté (sans réponse)' },
    { value: 'meeting_scheduled', label: 'Rendez-vous prévu' },
    { value: 'waiting_for_feedback', label: 'Attente de retour' },
    { value: 'follow_up_needed', label: 'Suivi nécessaire' },
    { value: 'qualified', label: 'Qualifié' },
    { value: 'converted', label: 'Converti' },
    { value: 'disqualified', label: 'Disqualifié' }
  ];
}