


"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function PixelPage() {
    const [selectedColor, setSelectedColor] = useState("#000000");
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawMode, setDrawMode] = useState(false);
    const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [startPanPos, setStartPanPos] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pixelSize = 10;
    const gridSize = 1000;
    const canvasSize = pixelSize * (gridSize / pixelSize);
    const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

    // 加载画布数据
    const loadCanvas = async () => {
        try {
            const response = await fetch('/api/pixel/canvas');
            const data = await response.json();

            if (data.imageData) {
                const canvas = canvasRef.current;
                if (!canvas) return;

                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const img = new Image();
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasSize, canvasSize);
                    ctx.drawImage(img, 0, 0);
                    drawGrid(ctx);
                };
                img.src = data.imageData;
            }
        } catch (error) {
            console.error('加载画布失败：', error);
        }
    };

    useEffect(() => {
        loadCanvas();
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        setViewportSize({
            width: window.innerWidth,
            height: window.innerHeight
        });

        const handleResize = () => {
            setViewportSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const drawGrid = (ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = "#EEEEEE";
        ctx.lineWidth = 0.5;

        for (let i = 0; i <= canvasSize; i += pixelSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvasSize);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvasSize, i);
            ctx.stroke();
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const isTouchEvent = 'touches' in e;
        const clientX = isTouchEvent ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = isTouchEvent ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        if (drawMode) {
            setIsDrawing(true);
            draw(clientX, clientY);
        } else {
            setIsPanning(true);
            setStartPanPos({
                x: clientX - panPosition.x,
                y: clientY - panPosition.y
            });
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        setIsPanning(false);
    };

    const saveCanvas = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        try {
            const response = await fetch('/api/pixel/canvas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageData: canvas.toDataURL(),
                }),
            });

            if (!response.ok) {
                throw new Error('保存失败');
            }

            // 使用更现代的通知方式
            showNotification('保存成功', 'success');
            await loadCanvas()
        } catch (error) {
            console.error('保存画布失败：', error);
            showNotification('保存失败', 'error');
        }
    };

    // 添加通知功能
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type, visible: true });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    const draw = (clientX: number, clientY: number) => {
        if (!isDrawing || !drawMode) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((clientX - rect.left) / pixelSize) * pixelSize;
        const y = Math.floor((clientY - rect.top) / pixelSize) * pixelSize;

        ctx.fillStyle = selectedColor;
        ctx.fillRect(x, y, pixelSize, pixelSize);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();

        const isTouchEvent = 'touches' in e;
        if (isTouchEvent && e.touches.length === 0) return;

        const clientX = isTouchEvent ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = isTouchEvent ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        if (drawMode) {
            draw(clientX, clientY);
        } else if (isPanning) {
            const newX = clientX - startPanPos.x;
            const newY = clientY - startPanPos.y;
            setPanPosition({ x: newX, y: newY });
        }
    };

    const toggleDrawMode = () => {
        setDrawMode(!drawMode);
        setIsDrawing(false);
        setIsPanning(false);
    };

    const colors = [
        "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
        "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080"
    ];

    return (
        <div className="min-h-screen mx-auto w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="max-w-4xl mx-auto">
                {/* 标题区域 */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                        像素涂鸦板
                    </h1>
                    {/* <p className="text-gray-600 dark:text-gray-300 mt-2">
                        创建、分享你的像素艺术作品
                    </p> */}
                </motion.div>

                {/* 工具栏 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6"
                >
                    <div className="flex flex-wrap items-center gap-4">
                        {/* 模式切换 */}
                        <div className="flex-shrink-0">
                            <button
                                onClick={toggleDrawMode}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${drawMode
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    }`}
                            >
                                <div className="flex items-center">
                                    {/* <span className="material-icons mr-2">
                                        {drawMode ? 'brush' : 'pan_tool'}
                                    </span> */}
                                    {drawMode ? '绘图模式' : '移动模式'}
                                </div>
                            </button>
                        </div>

                        {/* 颜色选择器 */}
                        <div className="flex-grow">
                            <div className="flex flex-wrap gap-2">
                                {colors.map((color) => (
                                    <motion.div
                                        key={color}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`w-8 h-8 rounded-lg cursor-pointer transition-all duration-200 ${selectedColor === color
                                            ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800'
                                            : 'hover:ring-1 hover:ring-gray-300'
                                            }`}
                                        style={{ backgroundColor: color, border: '1px solid rgba(0,0,0,0.1)' }}
                                        onClick={() => setSelectedColor(color)}
                                    />
                                ))}
                                <div className="relative">
                                    <input
                                        type="color"
                                        value={selectedColor}
                                        onChange={(e) => setSelectedColor(e.target.value)}
                                        className=" inset-0 w-8 h-8 cursor-pointer"

                                    />
                                    {/* <div className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-700">
                                        <span className="material-icons text-gray-600 dark:text-gray-300">
                                            color_lens
                                        </span>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        {/* 保存按钮 */}
                        <div className="flex-shrink-0">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={saveCanvas}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200"
                            >
                                <div className="flex items-center">
                                    {/* <span className="material-icons mr-2">save</span> */}
                                    保存
                                </div>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* 画布区域 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden touch-none"
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: Math.min(viewportSize.height * 0.6, 600),
                        touchAction: 'none',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        WebkitTouchCallout: 'none',
                    }}
                    onTouchMove={(e) => e.preventDefault()}
                >
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(${panPosition.x}px, ${panPosition.y}px)`,
                            cursor: drawMode ? 'crosshair' : 'grab',
                            touchAction: 'none',
                        }}
                    >
                        <canvas
                            ref={canvasRef}
                            width={canvasSize}
                            height={canvasSize}
                            onMouseDown={startDrawing}
                            onMouseMove={handleMouseMove}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={handleMouseMove}
                            onTouchEnd={stopDrawing}
                            onTouchCancel={stopDrawing}
                            className={`${drawMode ? "cursor-crosshair" : "cursor-grab"} touch-none`}
                            style={{ touchAction: 'none' }}
                        />
                    </div>
                </motion.div>

                {/* 状态信息 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-wrap gap-4 justify-between items-center"
                >
                    <div className="flex items-center">
                        <div className="w-6 h-6 rounded-md mr-2" style={{ backgroundColor: selectedColor }}></div>
                        <span className="text-gray-700 dark:text-gray-300">
                            当前颜色: <span style={{ color: selectedColor }}>{selectedColor}</span>
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className="material-icons mr-2 text-gray-600 dark:text-gray-400">
                            {/* {drawMode ? 'brush' : 'pan_tool'} */}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                            当前模式: {drawMode ? '绘图模式' : '移动模式'}
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* 通知组件 */}
            {notification.visible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${notification.type === 'success'
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                        }`}
                >
                    <div className="flex items-center">
                        {/* <span className="material-icons mr-2">
                            {notification.type === 'success' ? 'check_circle' : 'error'}
                        </span> */}
                        {notification.message}
                    </div>
                </motion.div>
            )}
        </div>
    );
}


