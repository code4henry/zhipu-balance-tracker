#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

def create_icon():
    size = 32
    img = Image.new('RGBA', (size, size), (79, 70, 229, 255))
    draw = ImageDraw.Draw(img)

    # 绘制简单的图标
    # 背景已经是紫色
    # 添加白色文字效果
    font = None  # 使用默认字体

    # 在中间绘制一个白色方块作为"智"字的效果
    margin = 8
    draw.rectangle([margin, margin, size-margin, size-margin], fill=(255, 255, 255, 255))

    # 保存图标
    icon_path = os.path.join(os.path.dirname(__file__), 'public', 'icon.png')
    os.makedirs(os.path.dirname(icon_path), exist_ok=True)
    img.save(icon_path)
    print(f'✅ 图标已创建: {icon_path}')

    # 同时创建更大的图标
    large_size = 128
    large_img = Image.new('RGBA', (large_size, large_size), (79, 70, 229, 255))
    large_draw = ImageDraw.Draw(large_img)

    margin = 32
    large_draw.rectangle([margin, margin, large_size-margin, large_size-margin], fill=(255, 255, 255, 255))

    large_icon_path = os.path.join(os.path.dirname(__file__), 'public', 'icon.png')
    large_img.save(large_icon_path)
    print(f'✅ 大图标已保存: {large_icon_path}')

if __name__ == '__main__':
    try:
        create_icon()
        print('图标创建完成！')
    except Exception as e:
        print(f'❌ 创建图标失败: {e}')
        print('请安装 Python PIL 库: pip3 install Pillow')
