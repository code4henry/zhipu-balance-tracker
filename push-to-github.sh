#!/bin/bash

# GitHub 推送助手
# 使用方法：./push-to-github.sh YOUR_GITHUB_USERNAME

echo "=== 智谱余额查看工具 - GitHub 推送助手 ==="
echo ""

if [ -z "$1" ]; then
    echo "请提供你的 GitHub 用户名："
    read -r GITHUB_USERNAME
else
    GITHUB_USERNAME="$1"
fi

REPO_NAME="zhipu-balance-tracker"
GITHUB_REPO="git@github.com:${GITHUB_USERNAME}/${REPO_NAME}.git"

echo "GitHub 仓库地址将是："
echo "  ${GITHUB_REPO}"
echo ""
echo "请按以下步骤操作："
echo ""
echo "1. 在浏览器中打开："
echo "   https://github.com/new"
echo ""
echo "2. 创建新仓库："
echo "   - Repository name: ${REPO_NAME}"
echo "   - 设为 Public 或 Private 均可"
echo "   - 不要勾选 README、.gitignore 等选项"
echo "   - 点击 'Create repository'"
echo ""
echo "3. 创建完成后，按回车继续..."
read

echo ""
echo "4. 正在推送代码到 GitHub..."
git remote add origin ${GITHUB_REPO} 2>/dev/null || git remote set-url origin ${GITHUB_REPO}
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 推送成功！"
    echo "🔗 仓库地址：https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
    echo ""
    echo "下一步：在 Railway 部署"
    echo "1. 访问：https://railway.app/"
    echo "2. 点击 'New Project' → 'Deploy from GitHub repo'"
    echo "3. 选择 ${REPO_NAME} 仓库"
    echo "4. Railway 会自动检测并部署 Node.js 项目"
else
    echo ""
    echo "❌ 推送失败，请检查："
    echo "   - GitHub SSH 密钥是否已配置"
    echo "   - 仓库是否已创建"
    echo "   - 用户名是否正确"
fi
