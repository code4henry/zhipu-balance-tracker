const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

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

module.exports = router;
