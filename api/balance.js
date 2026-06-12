const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const DATA_FILE = path.join(__dirname, '..', 'data', 'balances.json');

// 确保数据目录存在
async function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// 读取余额数据
async function readBalances() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

// 写入余额数据
async function writeBalances(data) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// 获取所有余额记录
router.get('/', async (req, res) => {
  try {
    const balances = await readBalances();
    const result = Object.entries(balances).map(([id, record]) => ({
      id,
      ...record,
      history: (record.history || []).slice(-10) // 只返回最近10条
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: '读取数据失败' });
  }
});

// 获取单个余额记录
router.get('/:id', async (req, res) => {
  try {
    const balances = await readBalances();
    const record = balances[req.params.id];
    if (!record) {
      return res.status(404).json({ error: '记录不存在' });
    }
    res.json({ id: req.params.id, ...record });
  } catch (error) {
    res.status(500).json({ error: '读取数据失败' });
  }
});

// 创建或更新余额记录
router.post('/', async (req, res) => {
  try {
    const { id, name, balance, unit, alertThreshold } = req.body;

    if (!id || !name) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const balances = await readBalances();
    const now = new Date().toISOString();
    const isNew = !balances[id];

    if (isNew) {
      balances[id] = {
        name,
        balance: parseFloat(balance) || 0,
        unit: unit || 'tokens',
        alertThreshold: parseFloat(alertThreshold) || 10000,
        createdAt: now,
        updatedAt: now,
        history: []
      };
    } else {
      balances[id].name = name;
      balances[id].balance = parseFloat(balance) || balances[id].balance;
      balances[id].unit = unit || balances[id].unit;
      balances[id].alertThreshold = parseFloat(alertThreshold) || balances[id].alertThreshold;
      balances[id].updatedAt = now;
    }

    // 添加历史记录
    balances[id].history.push({
      balance: balances[id].balance,
      timestamp: now
    });

    // 只保留最近50条历史记录
    if (balances[id].history.length > 50) {
      balances[id].history = balances[id].history.slice(-50);
    }

    await writeBalances(balances);
    res.json({ id, ...balances[id], isNew });
  } catch (error) {
    res.status(500).json({ error: '保存数据失败' });
  }
});

// 删除余额记录
router.delete('/:id', async (req, res) => {
  try {
    const balances = await readBalances();
    if (!balances[req.params.id]) {
      return res.status(404).json({ error: '记录不存在' });
    }
    delete balances[req.params.id];
    await writeBalances(balances);
    res.json({ success: true, deleted: req.params.id });
  } catch (error) {
    res.status(500).json({ error: '删除数据失败' });
  }
});

// 检查余额警告
router.get('/check-alerts', async (req, res) => {
  try {
    const balances = await readBalances();
    const alerts = [];

    for (const [id, record] of Object.entries(balances)) {
      if (record.balance <= record.alertThreshold) {
        alerts.push({
          id,
          name: record.name,
          balance: record.balance,
          threshold: record.alertThreshold,
          message: `${record.name} 余额低于 ${record.threshold} ${record.unit}`
        });
      }
    }

    res.json({ hasAlerts: alerts.length > 0, alerts });
  } catch (error) {
    res.status(500).json({ error: '检查警告失败' });
  }
});

// 查询智谱 Coding Plan 使用情况
router.post('/zhipu-usage', async (req, res) => {
  try {
    const { apiKey, region = 'cn' } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: '请提供 API Key' });
    }

    // 根据区域选择端点
    const endpoints = {
      cn: 'https://open.bigmodel.cn/api/monitor/usage/quota/limit',
      global: 'https://api.z.ai/api/monitor/usage/quota/limit'
    };

    const endpoint = endpoints[region] || endpoints.cn;

    // 调用智谱 API
    const response = await axios.get(endpoint, {
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (response.data && response.data.success) {
      const limits = response.data.data.limits || [];
      const level = response.data.data.level || 'unknown';

      // 解析不同类型的限制
      const tokenLimits = limits.filter(l => l.type === 'TOKENS_LIMIT');
      tokenLimits.sort((a, b) => (a.nextResetTime || 0) - (b.nextResetTime || 0));

      const timeLimit = limits.find(l => l.type === 'TIME_LIMIT');

      // 5小时额度（第一个 TOKENS_LIMIT）
      const hour5 = tokenLimits[0];
      // 每周额度（第二个 TOKENS_LIMIT）
      const weekly = tokenLimits[1];
      // MCP 每月额度
      const mcp = timeLimit;

      const result = {
        success: true,
        level,
        plans: []
      };

      // 添加5小时额度
      if (hour5) {
        result.plans.push({
          name: '5小时额度',
          type: 'hour5',
          used: hour5.percentage || 0,
          remaining: 100 - (hour5.percentage || 0),
          unit: '%',
          nextResetTime: hour5.nextResetTime
        });
      }

      // 添加每周额度
      if (weekly) {
        result.plans.push({
          name: '每周额度',
          type: 'weekly',
          used: weekly.percentage || 0,
          remaining: 100 - (weekly.percentage || 0),
          unit: '%',
          nextResetTime: weekly.nextResetTime
        });
      }

      // 添加 MCP 每月额度
      if (mcp) {
        result.plans.push({
          name: 'MCP每月',
          type: 'mcp',
          used: mcp.currentValue || 0,
          remaining: mcp.remaining || 0,
          total: mcp.usage || 1000,
          unit: '次'
        });
      }

      res.json(result);
    } else {
      res.status(400).json({
        error: '查询失败',
        message: response.data?.msg || '未知错误'
      });
    }
  } catch (error) {
    console.error('智谱用量查询错误:', error.response?.data || error.message);
    res.status(500).json({
      error: '查询失败',
      message: error.response?.data?.msg || error.message || '网络错误'
    });
  }
});

module.exports = router;
