import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    // Fetch agent run
    const { data: run, error: runErr } = await supabaseAdmin
      .from('agent_runs')
      .select('*')
      .eq('id', id)
      .single();

    if (runErr || !run) return NextResponse.json({ error: 'Run not found' }, { status: 404 });

    // Fetch associated content brief
    let brief = null;
    if (run.result_brief_id) {
      const { data: briefData } = await supabaseAdmin
        .from('content_briefs')
        .select('*')
        .eq('id', run.result_brief_id)
        .maybeSingle();

      if (briefData) {
        brief = {
          id: briefData.id,
          userId: briefData.user_id,
          companyId: briefData.company_id,
          agentRunId: briefData.agent_run_id,
          topic: briefData.topic,
          searchIntent: briefData.search_intent,
          primaryKeywords: briefData.primary_keywords ?? [],
          secondaryKeywords: briefData.secondary_keywords ?? [],
          faqs: briefData.faqs ?? [],
          competitorInsights: briefData.competitor_insights ?? [],
          contentOutline: briefData.content_outline ?? [],
          targetWordCount: briefData.target_word_count,
          tone: briefData.tone,
          platform: briefData.platform,
          status: briefData.status,
          generatedContent: briefData.generated_content,
          seoReport: briefData.seo_report,
          optimizationNotes: briefData.optimization_notes ?? [],
        };
      }
    }

    return NextResponse.json({
      run: {
        id: run.id,
        userId: run.user_id,
        workflowType: run.workflow_type,
        status: run.status,
        topic: run.topic,
        platform: run.platform,
        steps: run.steps ?? [],
        startedAt: run.started_at,
        completedAt: run.completed_at,
        error: run.error,
      },
      brief,
      content: brief?.generatedContent ?? null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
