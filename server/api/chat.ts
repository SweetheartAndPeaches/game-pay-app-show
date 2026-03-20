import type { Request, Response } from 'express';

// API Key 从环境变量读取，不在代码中硬编码
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
   代收任务佣金：一级1.0%、二级0.5%、三级0.3%
   代付任务佣金：一级0.8%、二级0.4%、三级0.2%
   
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

export async function handleChat(req: Request, res: Response) {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  if (!NVIDIA_API_KEY) {
    console.error('[Chat] NVIDIA_API_KEY is not configured');
    return res.status(500).json({ 
      error: 'AI service not configured. Please set NVIDIA_API_KEY environment variable.' 
    });
  }

  const allMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages
  ];

  try {
    console.log('[Chat] Sending request to NVIDIA API (z-ai/glm5)...');
    console.log('[Chat] API Key configured:', NVIDIA_API_KEY ? `${NVIDIA_API_KEY.slice(0, 10)}...` : 'NO');

    // 添加超时控制器
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25秒超时

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
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Chat] API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `NVIDIA API error: ${response.status}`,
        details: errorText.slice(0, 500)
      });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

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
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
    console.log('[Chat] Stream completed');
  } catch (error) {
    console.error('[Chat] Error:', error);
    
    // 判断错误类型
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isTimeout = errorMessage.includes('abort') || errorMessage.includes('timeout');
    const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network');
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: isTimeout ? 'Request timeout. Please try again.' : 
               isNetworkError ? 'Network error. Please check your connection.' : 
               'Failed to get response from AI',
        details: errorMessage
      });
    } else {
      res.write(`data: ${JSON.stringify({ content: '抱歉，我遇到点问题。请稍后再试。🙏' })}\n\n`);
      res.write('data: [DONE]\n\n`);
      res.end();
    }
  }
}
