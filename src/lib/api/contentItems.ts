// src/lib/api/contentItems.ts
import { api } from './client';
import type { ContentItem } from '$lib/types';

// APIと連携するためのコンテンツアイテム型定義（Pydanticスキーマに合わせる）
export interface ContentItemCreate {
  content_type: string;
  title?: string;
  description?: string;
  instagram_post_url: string;
}

// コンテンツアイテム関連のAPIサービス
export const contentItemsApi = {
  // コンテンツアイテム一覧を取得
  async getContentItems(clientId?: number): Promise<ContentItem[]> {
    const params: Record<string, string> = {};
    if (clientId) {
      params.client_id = clientId.toString();
    }
    return api.get<ContentItem[]>('/content-items/', params);
  },
  
  // コンテンツアイテム詳細を取得
  async getContentItem(id: number): Promise<ContentItem> {
    return api.get<ContentItem>(`/content-items/${id}`);
  },
  
  // コンテンツアイテムを作成
  async createContentItem(contentItemData: ContentItemCreate, clientId: number): Promise<ContentItem> {
    const params = { client_id: clientId.toString() };
    return api.post<ContentItem>('/content-items/', contentItemData);
  },
  
  // コンテンツアイテム情報を更新
  async updateContentItem(id: number, contentItemData: Partial<ContentItemCreate>): Promise<ContentItem> {
    return api.put<ContentItem>(`/content-items/${id}`, contentItemData);
  },
  
  // コンテンツアイテムを削除
  async deleteContentItem(id: number): Promise<void> {
    return api.delete(`/content-items/${id}`);
  }
};