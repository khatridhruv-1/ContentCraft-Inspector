import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { runFullPipeline } from '@/lib/agents/orchestrator';
import { publishToAll } from '@/lib/agents/publisher';

// Called by Vercel Cron every hour — checks if any user has a post due right now
export async function GET(req: Request) {
  // Verify cron secret so random people can't trigger this
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: any[] = [];
  const now = new Date();
  const todayDay = now.toLocaleDateString('en-US', { weekday: 'long' }); // "Monday"
  const nowHour = now.getHours();
  const nowMinute = now.getMinutes();

  // Get all brand profiles with auto-schedule enabled
  const { data: profiles } = await supabaseAdmin
    .from('brand_profiles')
    .select('*')
    .eq('is_setup_complete', true);

  for (const profile of profiles ?? []) {
    try {
      const schedule = profile.posting_schedule ?? {};
      const days: string[] = schedule.days ?? [];
      const [schedHour, schedMinute] = (schedule.time ?? '09:00').split(':').map(Number);

      // Check if today is a posting day and time matches (within same hour)
      if (!days.includes(todayDay)) continue;
      if (schedHour !== nowHour) continue;

      // Get next queued topic for this user
      const { data: queueItem } = await supabaseAdmin
        .from('content_queue')
        .select('*')
        .eq('user_id', profile.user_id)
        .eq('status', 'queued')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!queueItem) {
        // No topics in queue — auto-generate a topic from categories
        const category = (profile.content_categories ?? [])[Math.floor(Math.random() * (profile.content_categories?.length ?? 1))];
        if (!category) continue;

        // Create auto topic
        const { data: autoItem } = await supabaseAdmin
          .from('content_queue')
          .insert({
            user_id: profile.user_id,
            company_id: profile.company_id,
            topic: `Latest insights on ${category} for ${new Date().getFullYear()}`,
            platform: 'blog',
            status: 'queued',
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (!autoItem) continue;
        await runQueueItem(autoItem, profile, results);
      } else {
        await runQueueItem(queueItem, profile, results);
      }
    } catch (err: any) {
      results.push({ userId: profile.user_id, error: err.message });
    }
  }

  return NextResponse.json({ ran: results.length, results });
}

async function runQueueItem(queueItem: any, profile: any, results: any[]) {
  // Mark as running
  await supabaseAdmin
    .from('content_queue')
    .update({ status: 'running', started_at: new Date().toISOString() })
    .eq('id', queueItem.id);

  try {
    // Run full pipeline
    const result = await runFullPipeline({
      topic: queueItem.topic,
      platform: queueItem.platform,
      brandProfile: {
        id: profile.id,
        userId: profile.user_id,
        companyId: profile.company_id,
        brandName: profile.brand_name,
        websiteUrl: profile.website_url,
        industry: profile.industry,
        targetAudience: profile.target_audience,
        brandVoice: profile.brand_voice,
        brandColors: profile.brand_colors,
        socialAccounts: profile.social_accounts,
        contentCategories: profile.content_categories,
        postingSchedule: profile.posting_schedule,
        isSetupComplete: profile.is_setup_complete,
      },
      userId: profile.user_id,
    });

    // Auto-publish to all connected platforms
    const socialTokens: Record<string, any> = profile.social_tokens ?? {};
    const connectedPlatforms = Object.keys(socialTokens).filter(k => socialTokens[k]?.connected);

    if (connectedPlatforms.length > 0 && result.optimizedContent) {
      await publishToAll(
        result.optimizedContent,
        connectedPlatforms as any[],
        socialTokens,
        { title: result.brief?.topic }
      );
    }

    // Mark as done
    await supabaseAdmin
      .from('content_queue')
      .update({
        status: 'done',
        done_at: new Date().toISOString(),
        agent_run_id: result.agentRunId,
      })
      .eq('id', queueItem.id);

    results.push({
      userId: profile.user_id,
      topic: queueItem.topic,
      platform: queueItem.platform,
      status: 'done',
      agentRunId: result.agentRunId,
    });
  } catch (err: any) {
    await supabaseAdmin
      .from('content_queue')
      .update({ status: 'failed', error: err.message })
      .eq('id', queueItem.id);

    results.push({ userId: profile.user_id, topic: queueItem.topic, status: 'failed', error: err.message });
  }
}
