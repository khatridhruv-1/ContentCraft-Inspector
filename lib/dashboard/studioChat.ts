export type StudioChatRole = 'user' | 'assistant' | 'system';

export type StudioChatMessage = {
  id: string;
  role: StudioChatRole;
  content: string;
  createdAt: number;
  tone?: string;
  keywords?: string;
  status?: 'generating' | 'done' | 'error';
};

export function createChatMessage(
  partial: Omit<StudioChatMessage, 'id' | 'createdAt'> & { id?: string; createdAt?: number }
): StudioChatMessage {
  return {
    id: partial.id ?? crypto.randomUUID(),
    createdAt: partial.createdAt ?? Date.now(),
    ...partial,
  };
}

export const STUDIO_WELCOME_MESSAGE = createChatMessage({
  id: 'welcome',
  role: 'system',
  content:
    'Describe what you want to create — topic, audience, and angle. Your draft will appear in the preview panel.',
});
