// src/lib/utils/statusUtils.ts
import type { ClientStatus, ProspectStatus } from '$lib/types';

/**
 * クライアントステータスのフランス語表示名
 */
export const clientStatusLabels: Record<ClientStatus, string> = {
  'to_do': 'À faire',
  'in_progress': 'En cours',
  'done': 'Terminé'
};

/**
 * プロスペクトステータスのフランス語表示名
 */
export const prospectStatusLabels: Record<ProspectStatus, string> = {
  'new_inquiry': 'Nouvelle demande',
  'contact_attempted_phone': 'Contact tenté (téléphone)',
  'contact_attempted_email': 'Contact tenté (email)',
  'contacted_no_response': 'Contacté - Pas de réponse',
  'meeting_scheduled': 'Réunion programmée',
  'waiting_for_feedback': 'En attente de retour',
  'follow_up_needed': 'Suivi nécessaire',
  'qualified': 'Qualifié',
  'converted': 'Converti',
  'disqualified': 'Disqualifié'
};

/**
 * クライアントステータスのTailwind CSS色クラス
 */
export const clientStatusColors: Record<ClientStatus, string> = {
  'to_do': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'done': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
};

/**
 * プロスペクトステータスのTailwind CSS色クラス
 */
export const prospectStatusColors: Record<ProspectStatus, string> = {
  'new_inquiry': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'contact_attempted_phone': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'contact_attempted_email': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'contacted_no_response': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'meeting_scheduled': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'waiting_for_feedback': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  'follow_up_needed': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'qualified': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  'converted': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  'disqualified': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
};

/**
 * レガシーステータスから新しいクライアントステータスへの変換マッピング
 */
export const legacyClientStatusMapping: Record<string, ClientStatus> = {
  'contacted': 'to_do',
  'not_responded': 'to_do',
  'meeting_scheduled': 'to_do',
  'proposal_sent': 'to_do',
  'negotiation': 'to_do',
  'closed_won': 'in_progress',
  'closed_lost': 'done'
};

/**
 * レガシーステータスから新しいプロスペクトステータスへの変換マッピング
 */
export const legacyProspectStatusMapping: Record<string, ProspectStatus> = {
  'new': 'new_inquiry',
  'contacted': 'contact_attempted_email',
  'qualified': 'qualified',
  'converted': 'converted',
  'disqualified': 'disqualified'
};

/**
 * クライアントステータスの表示名を取得
 */
export function getClientStatusName(status: string): string {
  // 新しいステータスとして直接マッピング可能かチェック
  if (status in clientStatusLabels) {
    return clientStatusLabels[status as ClientStatus];
  }
  
  // レガシーステータスなら変換
  if (status in legacyClientStatusMapping) {
    const newStatus = legacyClientStatusMapping[status];
    return clientStatusLabels[newStatus];
  }
  
  // 未知のステータスの場合はそのまま返す
  return status;
}

/**
 * プロスペクトステータスの表示名を取得
 */
export function getProspectStatusName(status: string): string {
  // 新しいステータスとして直接マッピング可能かチェック
  if (status in prospectStatusLabels) {
    return prospectStatusLabels[status as ProspectStatus];
  }
  
  // レガシーステータスなら変換
  if (status in legacyProspectStatusMapping) {
    const newStatus = legacyProspectStatusMapping[status];
    return prospectStatusLabels[newStatus];
  }
  
  // 未知のステータスの場合はそのまま返す
  return status;
}

/**
 * クライアントステータスの色クラスを取得
 */
export function getClientStatusColorClass(status: string): string {
  // 新しいステータスとして直接マッピング可能かチェック
  if (status in clientStatusColors) {
    return clientStatusColors[status as ClientStatus];
  }
  
  // レガシーステータスなら変換
  if (status in legacyClientStatusMapping) {
    const newStatus = legacyClientStatusMapping[status];
    return clientStatusColors[newStatus];
  }
  
  // 未知のステータスの場合はデフォルト色を返す
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
}

/**
 * プロスペクトステータスの色クラスを取得
 */
export function getProspectStatusColorClass(status: string): string {
  // 新しいステータスとして直接マッピング可能かチェック
  if (status in prospectStatusColors) {
    return prospectStatusColors[status as ProspectStatus];
  }
  
  // レガシーステータスなら変換
  if (status in legacyProspectStatusMapping) {
    const newStatus = legacyProspectStatusMapping[status];
    return prospectStatusColors[newStatus];
  }
  
  // 未知のステータスの場合はデフォルト色を返す
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
}

/**
 * API通信時のステータス変換（レガシー → 新ステータス）
 */
export function convertApiClientStatus(status: string): ClientStatus {
  // 既に新しいステータス形式の場合
  if (status in clientStatusLabels) {
    return status as ClientStatus;
  }
  
  // レガシーステータスの変換
  if (status in legacyClientStatusMapping) {
    return legacyClientStatusMapping[status];
  }
  
  // デフォルト値
  return 'to_do';
}

/**
 * API通信時のステータス変換（レガシー → 新ステータス）
 */
export function convertApiProspectStatus(status: string): ProspectStatus {
  // 既に新しいステータス形式の場合
  if (status in prospectStatusLabels) {
    return status as ProspectStatus;
  }
  
  // レガシーステータスの変換
  if (status in legacyProspectStatusMapping) {
    return legacyProspectStatusMapping[status];
  }
  
  // デフォルト値
  return 'new_inquiry';
}

/**
 * クライアントステータス選択肢の生成（フォーム用）
 */
export function getClientStatusOptions(): Array<{value: ClientStatus, label: string}> {
  return Object.entries(clientStatusLabels).map(([value, label]) => ({
    value: value as ClientStatus,
    label
  }));
}

/**
 * プロスペクトステータス選択肢の生成（フォーム用）
 */
export function getProspectStatusOptions(): Array<{value: ProspectStatus, label: string}> {
  return Object.entries(prospectStatusLabels).map(([value, label]) => ({
    value: value as ProspectStatus,
    label
  }));
}