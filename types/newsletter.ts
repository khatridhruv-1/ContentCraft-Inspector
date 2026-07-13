export type NewsletterSubscriberStatus = 'active' | 'unsubscribed';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: NewsletterSubscriberStatus;
  unsubscribe_token: string;
  source: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export interface NewsletterIssue {
  id: string;
  topic: string;
  content_preview: string | null;
  subscriber_count: number;
  sent_at: string;
}
