// src/lib/api/clients.ts
import { api } from './client';
import type { Client } from '$lib/types';

// APIと連携するためのクライアント型定義（Pydanticスキーマに合わせる）
export interface ClientCreate {
  name: string;
  company_name?: string;
  business_category: string;
  contact_email?: string;
  contact_phone?: string;
  status?: string;
  signed_date?: string;
  estimated_monthly_revenue?: number;
}

// クライアント関連のAPIサービス
export const clientsApi = {
  // クライアント一覧を取得
  async getClients(): Promise<Client[]> {
    return api.get<Client[]>('/clients/');
  },
  
  // クライアント詳細を取得
  async getClient(id: number): Promise<Client> {
    return api.get<Client>(`/clients/${id}`);
  },
  
  // クライアントを作成
  async createClient(clientData: ClientCreate): Promise<Client> {
    return api.post<Client>('/clients/', clientData);
  },
  
  // クライアント情報を更新
  async updateClient(id: number, clientData: Partial<ClientCreate>): Promise<Client> {
    return api.put<Client>(`/clients/${id}`, clientData);
  },
  
  // クライアントを削除
  async deleteClient(id: number): Promise<void> {
    return api.delete(`/clients/${id}`);
  }
};