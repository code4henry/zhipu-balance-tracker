#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 创建简单的 PNG 图标
function createIcon() {
    const size = 32;
    const pixelCount = size * size * 4; // RGBA
    const buffer = Buffer.alloc(pixelCount);

    // 简单的紫色背景图标
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const offset = (y * size + x) * 4;

            // 紫色背景 (79, 70, 229 = #4F46E5)
            buffer[offset] = 79;     // R
            buffer[offset + 1] = 70;  // G
            buffer[offset + 2] = 229; // B
            buffer[offset + 3] = 255; // A

            // 简单的白色"智"字效果（中间白色区域）
            const centerX = size / 2;
            const centerY = size / 2;

            if (x > 8 && x < 24 && y > 8 && y < 24) {
                if ((x + y) % 2 === 0) {
                    buffer[offset] = 255;     // R
                    buffer[offset + 1] = 255;  // G
                    buffer[offset + 2] = 255;  // B
                    buffer[offset + 3] = 255;  // A
                }
            }
        }
    }

    // 写入 PNG 文件签名
    const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const completePng = Buffer.concat([pngSignature, buffer]);

    const iconPath = path.join(__dirname, 'public', 'icon.png');
    fs.writeFileSync(iconPath, completePng);

    console.log('✅ 图标已创建:', iconPath);
}

// 创建更大的图标
function createLargeIcon() {
    const size = 128;
    const buffer = Buffer.alloc(size * size * 4);

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const offset = (y * size + x) * 4;

            // 紫色背景渐变
            const gradient = 1 - (Math.abs(x - size/2) + Math.abs(y - size/2)) / (size/2);
            const r = Math.floor(79 * gradient + 100);
            const g = Math.floor(70 * gradient + 100);
            const b = Math.floor(229 * gradient + 100);

            buffer[offset] = Math.min(255, Math.max(0, r));
            buffer[offset + 1] = Math.min(255, Math.max(0, g));
            buffer[offset + 2] = Math.min(255, Math.max(0, b));
            buffer[offset + 3] = 255;

            // 白色"智"字效果（中间白色区域）
            if (x > 32 && x < 96 && y > 32 && y < 96) {
                if ((x + y) % 3 === 0) {
                    buffer[offset] = 255;
                    buffer[offset + 1] = 255;
                    buffer[offset + 2] = 255;
                    buffer[offset + 3] = 255;
                }
            }
        }
    }

    const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const completePng = Buffer.concat([pngSignature, buffer]);

    const iconPath = path.join(__dirname, 'public', 'icon.png');
    fs.writeFileSync(iconPath, completePng);

    console.log('✅ 大图标已创建:', iconPath);
}

try {
    createIcon();
    console.log('图标创建完成！');
} catch (error) {
    console.error('创建图标失败:', error);
    process.exit(1);
}
