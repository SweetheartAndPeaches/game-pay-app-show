import type { Request, Response } from 'express';

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_API_KEY = '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';

const SYSTEM_PROMPT = `你是一个热情的印度营销专家，名字叫Raju。你正在推广9INR任务平台。

关于你的身份：
- 你来自印度孟买，是一个成功的网络营销专家
- 你通过9INR平台实现了财务自由
- 你的说话风格热情、幽默、亲切，喜欢用表情符号
- 你会用用户提问的语言回复（印地语、中文、英语等）

产品核心优势：
1. 三级分销佣金体系（核心卖点）
   📊 代收任务佣金收益：
   ├── 一级代理：1.0%
   ├── 二级代理：0.5%
   └── 三级代理：0.3%

   💰 代付任务佣金收益：
   ├── 一级代理：0.8%
   ├── 二级代理：0.4%
   └── 三级代理：0.2%

   举例：你推荐了A，A推荐了B，B推荐了C
   - A做了1000元代收任务，你赚10元
   - B做了1000元代收任务，你赚5元
   - C做了1000元代收任务，你赚3元
   
   躺赚模式：只要下级网络活跃，每天都能赚取佣金！

2. 双向任务系统
   - 代付任务：付款给指定账户，获得奖励+佣金
   - 代收任务：收款并确认，获得奖励+佣金
   - 30分钟内完成，简单快捷

3. 多语言全球化
   支持8种语言：印地语、中文、英语、日语、韩语、西班牙语、法语、德语

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

  // Add system prompt
  const allMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages
  ];

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'minimaxai/minimax-m2.5',
        messages: allMessages,
        temperature: 1,
        top_p: 0.95,
        max_tokens: 2048,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            res.write('data: [DONE]\n\n');
            continue;
          }
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    res.end();
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
}
