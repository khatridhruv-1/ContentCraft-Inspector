import { getSupabaseAdmin } from '@/lib/supabase/server';
import type { NewsletterSubscriber, NewsletterSubscriberStatus } from '@/types/newsletter';

function createUnsubscribeToken(): string {
  return crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
}

export async function findSubscriberByEmail(email: string): Promise<NewsletterSubscriber | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as NewsletterSubscriber | null;
}

export async function findSubscriberByToken(token: string): Promise<NewsletterSubscriber | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .eq('unsubscribe_token', token)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as NewsletterSubscriber | null;
}

export async function subscribeEmail(
  email: string,
  source = 'landing'
): Promise<{ subscriber: NewsletterSubscriber; isNew: boolean }> {
  const normalized = email.trim().toLowerCase();
  const existing = await findSubscriberByEmail(normalized);

  if (existing) {
    if (existing.status === 'active') {
      return { subscriber: existing, isNew: false };
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'active' as NewsletterSubscriberStatus,
        unsubscribed_at: null,
        subscribed_at: new Date().toISOString(),
        source,
      })
      .eq('id', existing.id)
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return { subscriber: data as NewsletterSubscriber, isNew: true };
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert({
      email: normalized,
      unsubscribe_token: createUnsubscribeToken(),
      source,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return { subscriber: data as NewsletterSubscriber, isNew: true };
}

export async function unsubscribeByToken(token: string): Promise<{
  subscriber: NewsletterSubscriber | null;
  didUnsubscribe: boolean;
}> {
  const subscriber = await findSubscriberByToken(token);
  if (!subscriber) return { subscriber: null, didUnsubscribe: false };
  if (subscriber.status === 'unsubscribed') {
    return { subscriber, didUnsubscribe: false };
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .update({
      status: 'unsubscribed' as NewsletterSubscriberStatus,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('id', subscriber.id)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return { subscriber: data as NewsletterSubscriber, didUnsubscribe: true };
}

export async function listActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .eq('status', 'active')
    .order('subscribed_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as NewsletterSubscriber[];
}

export async function logNewsletterIssue(input: {
  topic: string;
  contentPreview: string;
  subscriberCount: number;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('newsletter_issues').insert({
    topic: input.topic,
    content_preview: input.contentPreview.slice(0, 500),
    subscriber_count: input.subscriberCount,
  });

  if (error) throw new Error(error.message);
}

export async function getRecentIssueTopics(limit = 14): Promise<string[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('newsletter_issues')
    .select('topic')
    .order('sent_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []).map(row => row.topic.toLowerCase());
}
