// API 基础路径
const API_BASE = '/api/balance';

// 全局状态
let balances = [];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    registerServiceWorker();
    loadBalances();
    setupForm();
    setupZhipuUsageForm();
    setupAutoRefresh();
});

// 注册 Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker 注册成功'))
            .catch(err => console.log('Service Worker 注册失败:', err));
    }
}

// 加载余额数据
async function loadBalances() {
    try {
        const response = await fetch(API_BASE);
        balances = await response.json();
        renderBalances();
    } catch (error) {
        console.error('加载失败:', error);
        showError('加载数据失败，请刷新重试');
    }
}

// 渲染余额卡片
function renderBalances() {
    const container = document.getElementById('balanceCards');

    if (balances.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                </div>
                <h3 class="empty-title">还没有添加账户</h3>
                <p class="empty-desc">点击右上角"添加账户"开始使用</p>
            </div>
        `;
        return;
    }

    container.innerHTML = balances.map(card => {
        const isAlert = card.balance <= card.alertThreshold;
        const lastUpdate = formatDate(card.updatedAt);
        const trend = calculateTrend(card.history);

        return `
            <div class="balance-card ${isAlert ? 'alert' : ''}" data-id="${card.id}">
                <div class="card-header">
                    <div class="card-title">${escapeHtml(card.name)}</div>
                    <div class="card-actions">
                        <button class="card-action-btn" onclick="editCard('${card.id}')" title="编辑">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="card-action-btn" onclick="deleteCard('${card.id}')" title="删除">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="balance-display">
                    <div class="balance-value">${formatNumber(card.balance)}</div>
                    <div class="balance-unit">${escapeHtml(card.unit)}</div>
                    ${isAlert ? `<div class="alert-badge">⚠️ 余额不足</div>` : ''}
                </div>
                <div class="balance-info">
                    <div class="info-item">
                        <div class="info-label">趋势</div>
                        <div class="info-value">${trend}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">阈值</div>
                        <div class="info-value">${formatNumber(card.alertThreshold)}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">更新</div>
                        <div class="info-value">${lastUpdate}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 计算趋势
function calculateTrend(history) {
    if (!history || history.length < 2) return '—';

    const latest = history[history.length - 1].balance;
    const previous = history[history.length - 2].balance;
    const diff = latest - previous;

    if (diff > 0) return '↑ ' + formatNumber(diff);
    if (diff < 0) return '↓ ' + formatNumber(Math.abs(diff));
    return '—';
}

// 格式化数字
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
}

// 格式化日期
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
    if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';

    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

// 转义 HTML
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// 打开模态框
function openModal(id = null) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('balanceForm');
    const editId = document.getElementById('editId');

    form.reset();

    if (id) {
        const card = balances.find(c => c.id === id);
        if (card) {
            title.textContent = '编辑账户';
            editId.value = id;
            document.getElementById('accountName').value = card.name;
            document.getElementById('balance').value = card.balance;
            document.getElementById('unit').value = card.unit;
            document.getElementById('alertThreshold').value = card.alertThreshold;
        }
    } else {
        title.textContent = '添加账户';
        editId.value = '';
    }

    modal.classList.add('active');
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

// 编辑卡片
function editCard(id) {
    openModal(id);
}

// 删除卡片
async function deleteCard(id) {
    if (!confirm('确定要删除这个账户吗？')) return;

    try {
        const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showToast('删除成功');
            loadBalances();
        } else {
            showError('删除失败');
        }
    } catch (error) {
        showError('删除失败');
    }
}

// 设置表单提交
function setupForm() {
    document.getElementById('balanceForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const editId = document.getElementById('editId').value;
        const data = {
            id: editId || generateId(),
            name: document.getElementById('accountName').value,
            balance: parseFloat(document.getElementById('balance').value),
            unit: document.getElementById('unit').value,
            alertThreshold: parseFloat(document.getElementById('alertThreshold').value)
        };

        try {
            const response = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showToast(editId ? '更新成功' : '添加成功');
                closeModal();
                loadBalances();
            } else {
                showError('保存失败');
            }
        } catch (error) {
            showError('保存失败');
        }
    });

    // 点击遮罩关闭
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });
}

// 生成 ID
function generateId() {
    return 'acct_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 设置自动刷新
function setupAutoRefresh() {
    // 每 5 分钟刷新一次
    setInterval(loadBalances, 5 * 60 * 1000);

    // 页面重新可见时刷新
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) loadBalances();
    });
}

// 显示提示
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// 显示错误
function showError(message) {
    showToast('❌ ' + message);
}

// 智谱额度查询相关函数
function openZhipuUsageModal() {
    const modal = document.getElementById('zhipuUsageModal');
    const form = document.getElementById('zhipuUsageForm');
    const result = document.getElementById('zhipuUsageResult');

    form.reset();
    result.style.display = 'none';
    modal.classList.add('active');
}

function closeZhipuUsageModal() {
    const modal = document.getElementById('zhipuUsageModal');
    modal.classList.remove('active');
}

async function queryZhipuUsage(e) {
    e.preventDefault();

    const apiKey = document.getElementById('zhipuApiKey').value;
    const region = document.getElementById('zhipuRegion').value;
    const resultDiv = document.getElementById('zhipuUsageResult');

    resultDiv.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    resultDiv.style.display = 'block';

    try {
        const response = await fetch(`${API_BASE}/zhipu-usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey, region })
        });

        const data = await response.json();

        if (data.success) {
            renderZhipuUsageResult(data);
        } else {
            resultDiv.innerHTML = `<div style="text-align: center; color: var(--danger); padding: 20px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4M12 16h.01"/>
                </svg>
                <p style="margin-top: 12px;">${data.message || '查询失败'}</p>
            </div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div style="text-align: center; color: var(--danger); padding: 20px;">
            <p>网络错误，请重试</p>
        </div>`;
    }
}

function renderZhipuUsageResult(data) {
    const resultDiv = document.getElementById('zhipuUsageResult');

    let html = `<div class="usage-level">📦 ${data.level === 'pro' ? 'Pro 版本' : '标准版本'}</div>`;
    html += '<div class="usage-plans">';

    data.plans.forEach(plan => {
        const percentage = plan.used;
        const statusClass = percentage >= 80 ? 'low' : percentage >= 50 ? 'medium' : 'good';
        const statusText = percentage >= 80 ? '余额不足' : percentage >= 50 ? '使用中' : '充足';

        html += `
            <div class="usage-plan">
                <div class="usage-plan-header">
                    <div class="usage-plan-name">${plan.name}</div>
                    <div class="usage-plan-badge ${statusClass}">${statusText}</div>
                </div>
                <div class="usage-progress">
                    <div class="usage-progress-bar ${statusClass}" style="width: ${percentage}%"></div>
                </div>
                <div class="usage-info">
                    <span>已用: ${plan.used}${plan.unit}</span>
                    <span>剩余: ${plan.remaining}${plan.unit}</span>
                </div>
            </div>
        `;
    });

    html += '</div>';

    resultDiv.innerHTML = html;
}

// 设置智谱额度查询表单
function setupZhipuUsageForm() {
    document.getElementById('zhipuUsageForm').addEventListener('submit', queryZhipuUsage);

    // 点击遮罩关闭
    document.getElementById('zhipuUsageModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeZhipuUsageModal();
    });
}

// 导出函数供 HTML 调用
window.openModal = openModal;
window.closeModal = closeModal;
window.editCard = editCard;
window.deleteCard = deleteCard;
window.openZhipuUsageModal = openZhipuUsageModal;
window.closeZhipuUsageModal = closeZhipuUsageModal;
