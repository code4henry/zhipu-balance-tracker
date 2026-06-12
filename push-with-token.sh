#!/bin/bash

echo "=== GitHub 推送助手 ==="
echo ""
echo "请按以下步骤操作："
echo ""
echo "1. 在浏览器中打开创建新仓库页面："
echo "   https://github.com/new"
echo ""
echo "2. 填写信息："
echo "   - Repository name: zhipu-balance-tracker"
echo "   - Description: 智谱AI平台Token余额查看工具"
echo "   - Public 或 Private 都可以"
echo "   - 不要勾选任何初始化选项"
echo "   - 点击 'Create repository'"
echo ""
echo "3. 创建完成后，在这里输入你的 GitHub Token（或按回车跳过）："
read -r TOKEN

if [ -n "$TOKEN" ]; then
    echo ""
    echo "正在使用 Token 推送..."
    cd ~/zhipu-balance-tracker
    git remote add origin https://code4henry:${TOKEN}@github.com/code4henry/zhipu-balance-tracker.git 2>/dev/null || git remote set-url origin https://code4henry:${TOKEN}@github.com/code4henry/zhipu-balance-tracker.git
    git branch -M main
    git push -u origin main

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 推送成功！"
        echo "🔗 https://github.com/code4henry/zhipu-balance-tracker"
    else
        echo ""
        echo "❌ 推送失败，请检查 Token 是否正确"
    fi
else
    echo ""
    echo "跳过 Token 推送。请手动执行以下命令："
    echo ""
    echo "  cd ~/zhipu-balance-tracker"
    echo "  git remote add origin https://github.com/code4henry/zhipu-balance-tracker.git"
    echo "  git branch -M main"
    echo "  git push -u origin main"
    echo ""
    echo "如果需要认证，会提示输入 GitHub 用户名和 Token"
fi
