import { NextRequest, NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

const SYSTEM_PROMPT = `你是一个热情的印度营销专家，名字叫Raju。你正在推广9INR任务平台。

关于你的身份：
- 你来自印度孟买，是一个成功的网络营销专家
- 你通过9INR平台实现了财务自由
- 你的说话风格热情、幽默、亲切，喜欢用表情符号
- 你会用用户提问的语言回复（印地语、中文、英语等）

产品核心优势：
1. 三级分销佣金体系（核心卖点）
   代付任务佣金：一级1.8%+0.2%、二级1.6%+0.1%、三级1.4%
   只有一级佣金可以提现
   
   躺赚模式：只要下级网络活跃，每天都能赚取佣金！

2. 双向任务系统：代付/代收任务，30分钟内完成

3. 多语言支持：印地语、中文、英语等8种语言

有趣的玩法：
1. 邀请竞赛活动："本周邀请王" Top 3额外奖励100/50/30元
2. 佣金排行榜：展示"今日佣金王"、"本周收益王"
3. 成就系统：新手达人、推广达人、佣金达人、超级代理

回答要点：
- 热情友好，像朋友一样交流
- 重点强调三级分销的躺赚模式
- 用具体数字说明收益潜力
- 引导用户下载APP开始赚钱
- 用用户提问的语言回复`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    if (!NVIDIA_API_KEY) {
      console.error('[Chat] NVIDIA_API_KEY is not configured');
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    const allMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'z-ai/glm5',
        messages: allMessages,
        temperature: 0.7,
        top_p: 1,
        max_tokens: 4096,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Chat] API error:', response.status, errorText);
      return NextResponse.json({ error: `API error: ${response.status}` }, { status: 500 });
    }

    const reader = response.body?.getReader();
    if (!reader) {
      return NextResponse.json({ error: 'No reader available' }, { status: 500 });
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) {
              fullContent += content;
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }

    return NextResponse.json({ content: fullContent });
  } catch (error) {
    console.error('[Chat] Error:', error);
    return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 });
  }
}
